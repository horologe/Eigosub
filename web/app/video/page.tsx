"use client";

import { Subtitle as SubtitleType } from "@/model/api";
import { createFlashcard, deleteFlashcard, getDict, getSubtitles } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import Subtitle from "./subtitle";
import { useSelectedWordStore } from "@/hooks/selected-word";
import Dict from "./dict";
import { DictEntry } from "@/model/dict";

function getVideoId(url: string) {
    const videoId = url.split("v=")[1];
    return videoId;
}

export default function VideoPage() {
    const [url, setUrl] = useState("https://www.youtube.com/watch?v=z4K2F_OALPQ");
    const [subtitles, setSubtitles] = useState<SubtitleType[]>([]);
    const [subtitle, setSubtitle] = useState<SubtitleType | null>(null);
    const [dict, setDict] = useState<DictEntry>([]);
    const { selectedWord } = useSelectedWordStore();
    // const { flashcards } = useFlashcardsStore();
    

    useEffect(() => {
        if (selectedWord) {
            getDict(selectedWord).then((response) => {
                setDict(response.dict);
            });
        }
    }, [selectedWord]);
    
    const playerRef = useRef<YouTubePlayer>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await getSubtitles(getVideoId(url));
        if (response.result === "success") {
            setSubtitles(response.subtitles);
        } else {
            setSubtitles([]);
        }
    }

    const onPlayerReady = (event: any) => {
        playerRef.current = event.target;
    }

    useEffect(() => {
        const id = setInterval(() => {
            if (playerRef.current) {
                const currentTime = playerRef.current.getCurrentTime();
                const subtitle = subtitles.find((subtitle) => subtitle.start <= currentTime && currentTime <= subtitle.start + subtitle.duration);
                if (subtitle) {
                    setSubtitle(subtitle);
                } else {
                    setSubtitle(null);
                }
            }
        }, 50);

        return () => clearTimeout(id);
    }, [playerRef.current, subtitles])

    const handleAddToFlashcard = async () => {
        if (selectedWord) {
            const response = await createFlashcard(selectedWord);
            if (response.result === "success") {
                setFlashcardId(response.flashcard.id);
            }
        }
    };

    const handleDeleteFromFlashcard = () => {
        if (selectedWord && flashcardId) {
            deleteFlashcard(flashcardId);
            setFlashcardId(null);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-2"></div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=z4K2F_OALPQ" className="dark:bg-secondary text-lg rounded-md w-lg focus:outline-4 focus:outline-secondary/80 focus:border-none h-10"/>
                <button type="submit" className="bg-primary text-black rounded-md px-4 py-2 h-10 font-bold">Submit</button>
            </form>


            <YouTube videoId={getVideoId(url)} onReady={onPlayerReady}/>

            
            <div className="h-[100px]">
                {subtitle && <Subtitle subtitle={subtitle} />}    
            </div>


            {selectedWord && (flashcardId ? <p className="text-sm text-blue-200 hover:underline" onClick={handleDeleteFromFlashcard}>{selectedWord}を単語帳から削除</p> : <p className="text-sm text-blue-200 hover:underline" onClick={handleAddToFlashcard}>{selectedWord}を単語帳に追加</p>)}

            {dict.map((word, index) => <Dict word={word} key={index} />)}
        </div>
    );
}