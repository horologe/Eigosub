<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FlashcardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $flashcards = $request->user()->flashcards;
        return response()->json([
            "flashcards" => $flashcards,
            "result" => "success",
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $flashcard = $request->user()->flashcards()->create($request->all());
        return response()->json([
            "flashcard" => $flashcard,
            "result" => "success",
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Flashcard $flashcard)
    {
        return response()->json([
            "flashcard" => $flashcard,
            "result" => "success",
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Flashcard $flashcard)
    {
        $flashcard->update($request->all());
        return response()->json([
            "flashcard" => $flashcard,
            "result" => "success",
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Flashcard $flashcard)
    {   
        if ($flashcard->user_id !== $request->user()->id) {
            return response()->json([
                "result" => "failed",
                "error" => "Unauthorized",
            ], 403);
        }
        
        $flashcard->delete();
        return response()->json([
            "result" => "success",
        ], 204);
    }
}
