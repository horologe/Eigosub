import axios from "axios";
import { CommonResponse, GetSubtitlesResponse, LoginResponse, MeResponse, RegisterResponse } from "@/model/api";

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
    if (error.response.status === 401) {
        localStorage.removeItem("token");
        location.href = "/login";
    }
    return Promise.reject(error);
});

export const getSubtitles = async (videoId: string): Promise<GetSubtitlesResponse> => {
    const response = await api.get(`/get-subtitles`, {
        params: { videoId },
    });
    return response.data[0];
};

export const register = async (username: string, password: string): Promise<RegisterResponse> => {
    const response = await api.post(`/auth/register`, { username, password });
    return response.data;
};

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    await getCsrfCookie();
    const response = await api.post(`/auth/login`, { username, password });
    return response.data;
};

export const logout = async (): Promise<CommonResponse> => {
    const response = await api.post(`/auth/logout`);
    return response.data;
};

export const me = async (): Promise<MeResponse> => {
    const response = await api.get(`/auth/me`);
    return response.data;
};

export const getCsrfCookie = async (): Promise<CommonResponse> => {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`);
    return response.data;
};