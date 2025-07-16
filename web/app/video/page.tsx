"use client";

import { RawSubtitle, Subtitle as SubtitleType } from "@/model/api";
import { createFlashcard, deleteFlashcard, getDict, getFlashcards, getSubtitles, procSubtitles } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import Subtitle from "./subtitle";
import { useSelectedWordStore } from "@/hooks/selected-word";
import Dict from "./dict";
import { DictEntry } from "@/model/dict";
import useSWR from "swr";

function getVideoId(url: string) {
    const videoId = url.split("v=")[1];
    return videoId;
}

export default function VideoPage() {
    const [url, setUrl] = useState("https://www.youtube.com/watch?v=z4K2F_OALPQ");
    

    const [subtitle, setSubtitle] = useState<SubtitleType[]>([]);
    const [dict, setDict] = useState<DictEntry>([]);
    const { selectedWord } = useSelectedWordStore();
    const { data, mutate} = useSWR("flashcards", getFlashcards);
    const flashcardId = data?.flashcards.find((flashcard) => flashcard.content === selectedWord)?.id;


    const [rawSubtitles, setRawSubtitles] = useState<RawSubtitle[]>([]);
    const processedSubtitles = useRef<SubtitleType[]>([]);

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
        setRawSubtitles([]);
        const response = await getSubtitles(getVideoId(url));
        if (response.result === "success") {
            setRawSubtitles(response.subtitles);

        }
    }

    const onPlayerReady = (event: any) => {
        playerRef.current = event.target;
    }

    useEffect(() => {
        const id = setInterval(() => {
            if (!playerRef.current) return;
            const currentTime = playerRef.current.getCurrentTime();
            
            let i = 0;
            let res = [];
            for (; i < rawSubtitles.length; i++) {
                const subtitle = rawSubtitles[i];
                if (subtitle.start <= currentTime && currentTime <= subtitle.start + subtitle.duration) {
                    if (processedSubtitles.current[i]) {
                        res.push(processedSubtitles.current[i]);
                    } else {
                        res.push({
                            text: [{
                                content: rawSubtitles[i].text,
                                meaning: ""
                            }],
                            start: rawSubtitles[i].start,
                            duration: rawSubtitles[i].duration,
                        });
                    }
                } else if (currentTime < rawSubtitles[i].start) {
                    break;
                }
            }
            setSubtitle(res);
            
            // 10秒以内に処理されていない字幕があるかどうか
            let flag = false;
            for (let j = i; j < rawSubtitles.length && rawSubtitles[j].start < currentTime + 30; j++) {
                if (!processedSubtitles.current[j]) {
                    flag = true;
                    break;
                }
            }

            if (!flag) return;

            // 30秒以内の字幕を処理
            let q = [];
            let subs = [];
            for (let j = i; j < rawSubtitles.length && rawSubtitles[j].start < currentTime + 60; j++) {
                if (!processedSubtitles.current[j]) {
                    q.push(j);
                     subs.push(rawSubtitles[j]);
                     // 一時的にprocessedSubtitlesをrawSubtitlesにする
                     processedSubtitles.current[j] = {
                        text: [{
                            content: rawSubtitles[j].text,
                            meaning: ""
                        }],
                        start: rawSubtitles[j].start,
                        duration: rawSubtitles[j].duration
                     };
                }
            }

            if (flag) {
                procSubtitles(subs).then((response) => {
                    response.subtitles.map((s, i) => {
                        processedSubtitles.current[q[i]] = s;
                    })
                });
            }
        }, 50);
        return ()=> clearTimeout(id);
    }, [playerRef.current, rawSubtitles])
    const handleAddToFlashcard = async () => {
        if (selectedWord) {
        const response = await createFlashcard(selectedWord);
            if (response.result === "success") {
            mutate();
        }
    }
    };

   const handleDeleteFromFlashcard = () => {
if (selectedWord && flashcardId) {
         deleteFlashcard(flashcardId);
            mutate();
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-2"></div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=z4K2F_OALPQ" className="dark:bg-secondary text-lg rounded-md w-lg focus:outline-4 focus:outline-secondary/80 focus:border-none h-10"/>
                <button type="submit" className="bg-primary text-black rounded-md px-4 py-2 h-10 font-bold">Submit</button>
            </form>


            <YouTube videoId={getVideoId(url)} onReady={onPlayerReady} />

            
            <div className="h-[100px]">
                {subtitle.map((s, i) => <Subtitle subtitle={s} key={i} />)}    
            </div>


            {selectedWord && (flashcardId ? <p className="text-sm text-blue-200 hover:underline" onClick={handleDeleteFromFlashcard}>{selectedWord}を単語帳から削除</p> : <p className="text-sm text-blue-200 hover:underline" onClick={handleAddToFlashcard}>{selectedWord}を単語帳に追加</p>)}

            {dict.map((word, index) => <Dict word={word} key={index} />)}
        </div>
    );
}