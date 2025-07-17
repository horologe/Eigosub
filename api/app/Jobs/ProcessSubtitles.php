<?php

namespace App\Jobs;

use App\Models\ProcessedSubtitle;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProcessSubtitles implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $processedSubtitle;
    protected $subtitles;

    /**
     * Create a new job instance.
     */
    public function __construct(ProcessedSubtitle $processedSubtitle, array $subtitles)
    {
        $this->processedSubtitle = $processedSubtitle;
        $this->subtitles = $subtitles;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->processedSubtitle->update(['status' => 'processing']);

        try {
            $subtitlesJson = json_encode($this->subtitles);

            $apiKey = env('GEMINI_API_KEY');
            if (!$apiKey) {
                throw new \Exception('GEMINI_API_KEY is not set in .env file.');
            }

            $prompt = <<<EOF
            添付されたJSONについて、基本的に全てそのまま書き出してください。それぞれの字幕について、イディオムごとに区切り、contentには字幕を、meaningにはイディオムの意味で、短く簡潔に書いてください。また、イディオムでない箇所はmeaningを空文字で出力してください。次はturn on the lightの例です。the lightの前にスペースが入っていることに注意してください。

            {
                "text": [
                    {
                        "content": "turn on",
                        "meaning": "点ける"
                    },
                    {
                        "content": " the light",
                        "meaning": ""
                    }
                ],
                "start": 0,
                "duration": 1000
            }
EOF;

            $response = Http::timeout(600)->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey, [
                'system_instruction' => [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ],
                'contents' => [['parts' => [['text' => $subtitlesJson],]]],
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
                throw new \Exception('Gemini API request failed. Status: ' . $response->status() . ' Body: ' . $response->body());
            }

            $result = $response->json();
            $jsonText = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

            $this->processedSubtitle->update([
                'status' => 'completed',
                'result' => json_decode($jsonText, true),
            ]);

        } catch (\Exception $e) {
            $this->processedSubtitle->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }
    }
}