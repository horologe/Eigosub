<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VideoSubController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FlashcardController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [UserController::class, 'logout']);
    Route::get('/auth/me', [UserController::class, 'me']);
    Route::get('/get-subtitles', [VideoSubController::class, 'getSubtitles']);

    Route::apiResource('flashcards', FlashcardController::class);
});

Route::post('/auth/register', [UserController::class, 'register']);
Route::post('/auth/login', [UserController::class, 'login']);