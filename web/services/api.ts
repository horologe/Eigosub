import axios from "axios";
import { GetSubtitlesResponse } from "@/model/api";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

export const getSubtitles = async (videoId: string): Promise<GetSubtitlesResponse> => {
    const response = await api.get(`/get-subtitles`, {
        params: { videoId },
    });
    return response.data[0];
};
