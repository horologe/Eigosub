<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VideoSubController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\DictController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [UserController::class, 'logout']);
    Route::get('/auth/me', [UserController::class, 'me']);
    Route::get('/get-subtitles', [VideoSubController::class, 'getSubtitles']);
    Route::get('/get-dict', [DictController::class, 'getDict']);

    Route::post('/proc-subtitles', [VideoSubController::class, 'procSubtitles']);
    Route::get('/proc-subtitles/{id}', [VideoSubController::class, 'getProcessedSubtitle']);

    Route::apiResource('flashcards', FlashcardController::class);
});

Route::post('/auth/register', [UserController::class, 'register']);
Route::post('/auth/login', [UserController::class, 'login']);