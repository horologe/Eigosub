import { DictEntry } from "./dict";

export type CommonResponse<T> = ({
    result: "success"
} & T) | {
    result: "failed";
    error: string;
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

export type GetSubtitlesResponse = CommonResponse<{
        subtitles: RawSubtitle[]
    }>;

export type RegisterResponse = {
    user: {
        id: number;
        username: string;
    };
} & CommonResponse<{
    user: {
        id: number;
        username: string;
    };
}>;

export type LoginResponse = {
    token: string;
} & CommonResponse<{
    token: string;
}>;

export type MeResponse = {
    user: {
        id: number;
        username: string;
    };
} & CommonResponse<{
    user: {
        id: number;
        username: string;
    };
}>;

export type Flashcard = {
    id: number;
    content: string;
};

export type FlashcardResponse = {
    flashcard: Flashcard;
} & CommonResponse<{
    flashcard: Flashcard;
}>;

export type FlashcardsResponse = {
    flashcards: Flashcard[];
} & CommonResponse<{
    flashcards: Flashcard[];
}>;

export type ProcSubtitlesResponse = {
    subtitles: Subtitle[]
} & LazyResponse;

export type GetDictResponse = {dict: DictEntry} & CommonResponse<{
    dict: DictEntry;
}>;