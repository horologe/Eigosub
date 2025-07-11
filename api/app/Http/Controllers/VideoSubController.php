<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
            
            return response()->json([
                'result' => 'success',
                ...$subtitles
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'result' => 'failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


