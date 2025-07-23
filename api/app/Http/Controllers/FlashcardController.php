<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Gate;

class FlashcardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Flashcard::class);
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
        Gate::authorize('create', Flashcard::class);
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
        Gate::authorize('view', $flashcard);
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
        Gate::authorize('update', $flashcard);
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
        Gate::authorize('delete', $flashcard);
        $flashcard->delete();
        return response()->json([
            "result" => "success",
        ], 204);
    }
}
