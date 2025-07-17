<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Jobs\ProcessSubtitles;
use App\Models\ProcessedSubtitle;

class VideoSubController extends Controller
{
    public function getSubtitles(Request $request)
    {
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

            return response()->json([
                'result' => 'success',
                'subtitles' => $subtitles[0]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'result' => 'failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function procSubtitles(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subtitles' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'result' => 'failed',
                'error' => $validator->errors()
            ], 422);
        }

        $processedSubtitle = $request->user()->processedSubtitles()->create([
            'status' => 'pending',
        ]);

        ProcessSubtitles::dispatch($processedSubtitle, $request->input('subtitles'));

        return response()->json([
            'result' => 'success',
            'job_id' => $processedSubtitle->id,
        ], 202);
    }

    public function getProcessedSubtitle(Request $request, $id)
    {
        $job = ProcessedSubtitle::where('user_id', $request->user()->id)->findOrFail($id);

        return response()->json([
            'status' => $job->status,
            'subtitles' => $job->result,
            'error' => $job->error_message,
        ]);
    }
}