<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VideoSubController extends Controller
{
    public function getSubtitles(Request $request)
    {
        $request->validate([
            'videoId' => 'required|string'
        ]);

        $videoId = $request->input('videoId');
        
        try {
            $command = "youtube_transcript_api " . escapeshellarg($videoId) . " --languages en --format json";
            $output = shell_exec($command);
            
            if ($output === null) {
                return response()->json([
                    'error' => 'Failed to get subtitles'
                ], 500);
            
            }

            $subtitles = json_decode($output, true);
            
            return response()->json($subtitles);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


