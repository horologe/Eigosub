<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DictController extends Controller
{
    public function getDict(Request $request)
    {
        $request->validate([
            "word" => "string|required"
        ]);
        $word = $request->input("word");
        try {
            $output = shell_exec("/Users/eita/Downloads/tkrzw-dict/dict " . escapeshellarg($word));
            $output = json_decode($output);
            if ($output == null) {
                $output = [];
            }
            return response()->json([
                'result' => 'success',
                'dict' => $output
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'result' => 'failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}