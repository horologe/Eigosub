<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class VideoSubController extends Controller
{
    public function getSubtitles(Request $request)
    {
        set_time_limit(60);

        $validator = Validator::make($request->all(), [
            'videoId' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'result' => 'failed',
                'error' => $validator->errors()
            ], 422);
        }

        $videoId = $request->input('videoId');

        try {
            $command = "youtube_transcript_api " . escapeshellarg($videoId) . " --languages en --format json";
            $output = shell_exec($command);

            if ($output === null) {
                return response()->json([
                    'result' => 'failed',
                    'error' => 'Failed to get subtitles'
                ], 500);
            }

            $subtitles = json_decode($output, true);
            if ($subtitles === null) {
                return response()->json([
                    'result' => 'failed',
                    'error' => 'Failed to decode subtitles'
                ], 500);
            }

            $apiKey = env('GEMINI_API_KEY');
            if (!$apiKey) {
                Log::error('GEMINI_API_KEY is not set in .env file.');
                return response()->json(['result' => 'failed', 'error' => 'API key is not configured.'], 500);
            }

            // Construct a prompt for Gemini
            $prompt = <<<EOF
            添付されたJSONについて、基本的に全てそのまま書き出してください。それぞれの字幕について、イディオムごとに区切り、contentには字幕を、meaningにはイディオムの意味で、短く簡潔に書いてください。また、イディオムでない箇所はmeaningを空文字で出力してください。次はturn on the lightの例です。

            {
                "text": [
                    {
                        "content": "turn on",
                        "meaning": "点ける"
                    }, 
                    {
                        "content": "the light",
                        "meaning": ""
                    }
                ],
                "start": 0,
                "duration": 1000
            }
EOF;
            $response = Http::timeout(60)->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey, [
                'system_instruction' => [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ],
                'contents' => [[
                    'parts' => [
                        ['text' => $output],
                    ]
                ]],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'responseSchema' => [
                        'type' => 'array',
                        'items' => ['type' => 'object', 'properties' => [
                            'text' => ['type' => 'array', 'items' => ['type' => 'object', 'properties' => [
                                'content' => ['type' => 'string'],
                                'meaning' => ['type' => 'string']
                            ]]],
                            'start' => ['type' => 'number'],
                            'duration' => ['type' => 'number']
                        ]]
                    ]
                ]
            ]);

            if ($response->failed()) {
                Log::error('Gemini API request failed.', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return response()->json(['result' => 'failed', 'error' => 'Failed to communicate with Gemini API.'], $response->status());
            }

            $result = $response->json();

            // Extract the text, remove markdown backticks and "json" label
            $jsonText = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

            return response()->json([
                'result' => 'success',
                'subtitles' => json_decode($jsonText, true)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'result' => 'failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
