"use client";

import { GetSubtitlesResponse } from "@/model/api";
import { getSubtitles } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import Subtitle from "./subtitle";

function getVideoId(url: string) {
    const videoId = url.split("v=")[1];
    return videoId;
}

export default function VideoPage() {
    const [url, setUrl] = useState("https://www.youtube.com/watch?v=z4K2F_OALPQ");
    const [subtitles, setSubtitles] = useState<GetSubtitlesResponse>([]);
    const [subtitle, setSubtitle] = useState("");

    
    
    const playerRef = useRef<YouTubePlayer>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubtitles(await getSubtitles(getVideoId(url)));
    }

    const onPlayerReady = (event: any) => {
        playerRef.current = event.target;
    }

    useEffect(() => {
        const id = setInterval(() => {
            if (playerRef.current) {
                const currentTime = playerRef.current.getCurrentTime();
                const subtitle = subtitles.find((subtitle) => subtitle.start <= currentTime && currentTime <= subtitle.start + subtitle.duration);
                setSubtitle(subtitle?.text || "");
            }
        }, 50);

        return () => clearTimeout(id);
    }, [playerRef.current])

    return (
        <div>
            <div className="flex flex-col gap-2"></div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=z4K2F_OALPQ" className="dark:bg-secondary text-lg rounded-md w-lg focus:outline-4 focus:outline-secondary/80 focus:border-none h-10"/>
                <button type="submit" className="bg-primary text-black rounded-md px-4 py-2 h-10 font-bold">Submit</button>
            </form>

            <YouTube videoId={getVideoId(url)} onReady={onPlayerReady}/>

            <Subtitle subtitle={subtitle} />    
        </div>
    );
}