import { DictEntry } from "./dict";

export type CommonResponse = {
    result: "success" | "failed";
    error?: string;
};

export type LazyResponse = {
    status: "completed" | "failed" | "pending";
    error?: string;
};

export type RawSubtitle = {
    text: string,
    start: number,
    duration: number
}

export type Subtitle = {
    text: {
        content: string,
        meaning: string
    }[],
    start: number,
    duration: number
}

export type GetSubtitlesResponse = 
    {
        subtitles: RawSubtitle[]
    } & CommonResponse;

export type RegisterResponse = {
    user: {
        id: number;
        username: string;
    };
} & CommonResponse;

export type LoginResponse = {
    token: string;
} & CommonResponse;

export type MeResponse = {
    user: {
        id: number;
        username: string;
    };
} & CommonResponse;

export type Flashcard = {
    id: number;
    content: string;
};

export type FlashcardResponse = {
    flashcard: Flashcard;
} & CommonResponse;

export type FlashcardsResponse = {
    flashcards: Flashcard[];
} & CommonResponse;

export type ProcSubtitlesResponse = {
    subtitles: Subtitle[]
} & LazyResponse;

export type GetDictResponse = {dict: DictEntry} & CommonResponse;