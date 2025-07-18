import axios from "axios";
import { CommonResponse, Flashcard, FlashcardResponse, FlashcardsResponse, GetDictResponse, GetSubtitlesResponse, LoginResponse, MeResponse, ProcSubtitlesResponse, RawSubtitle, RegisterResponse } from "@/model/api";

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Accept": "application/json",
    }, 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 401 && location.pathname !== "/login") {
        localStorage.removeItem("token");
        location.href = "/login";
    }
    return Promise.reject(error);
});

export const getSubtitles = async (videoId: string): Promise<GetSubtitlesResponse> => {
    const response = await api.get(`/get-subtitles`, {
        params: { videoId },
        timeout: 60000,
    });
    return response.data;
};

export const register = async (username: string, password: string): Promise<RegisterResponse> => {
    await getCsrfCookie();
    const response = await api.post(`/auth/register`, { username, password });
    return response.data;
};

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    await getCsrfCookie();
    const response = await api.post(`/auth/login`, { username, password });
    return response.data;
};

export const logout = async (): Promise<CommonResponse<{}>> => {
    const response = await api.post(`/auth/logout`);
    return response.data;
};

export const me = async (): Promise<MeResponse> => {
    const response = await api.get(`/auth/me`);
    return response.data;
};

export const getCsrfCookie = async (): Promise<CommonResponse<{}>> => {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`);
    return response.data;
};

export const getFlashcards = async (): Promise<FlashcardsResponse> => {
    const response = await api.get(`/flashcards`);
    return response.data;
};

export const createFlashcard = async (content: string): Promise<FlashcardResponse> => {
    const response = await api.post(`/flashcards`, { content });
    return response.data;
};

export const deleteFlashcard = async (flashcardId: number): Promise<FlashcardResponse> => {
    const response = await api.delete(`/flashcards/${flashcardId}`);
    return response.data;
};

export const getDict = async (word: string): Promise<GetDictResponse> => {
    const response = await api.get('/get-dict', {params: {word}});
    return response.data;
}

export const procSubtitles = async (subtitles: RawSubtitle[]): Promise<{result: string, job_id: number}> => {
    const response = await api.post(`/proc-subtitles`, { subtitles });
    return response.data;
}

export const getProcessedSubtitle = async (jobId: number): Promise<ProcSubtitlesResponse> => {
    const response = await api.get(`/proc-subtitles/${jobId}`);
    return response.data;
}