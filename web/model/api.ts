export type CommonResponse = {
    result: "success" | "failed";
    error?: string;
}

export type GetSubtitlesResponse = 
    {
        text: string,
        start: number,
        duration: number
    }[] & CommonResponse;

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

export type FlashcarsdResponse = {
    flashcards: Flashcard[];
} & CommonResponse;