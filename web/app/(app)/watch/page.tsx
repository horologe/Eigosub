"use client";

import { RawSubtitle, Subtitle as SubtitleType } from "@/model/api";
import { createFlashcard, deleteFlashcard, getDict, getFlashcards, getSubtitles, procSubtitles, getProcessedSubtitle } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import Subtitle from "./subtitle";
import { useSelectedWordStore } from "@/hooks/selected-word";
import Dict from "./dict";
import { DictEntry } from "@/model/dict";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";

export default function VideoPage() {
    const videoid = useSearchParams().get("v") as string;

    const [subtitle, setSubtitle] = useState<SubtitleType[]>([]);
    const { selectedWord } = useSelectedWordStore();
    const { data: dict, error: dictError, isLoading: dictLoading } = useSWR("dict-" + selectedWord, () => getDict(selectedWord).then((response) => response.dict));
    const { data: flashcards, mutate: mutateFlashcards } = useSWR("flashcards", getFlashcards);
    const flashcardId = flashcards?.flashcards.find((flashcard) => flashcard.content === selectedWord)?.id;

    const { data: rawSubtitles, error, isLoading } = useSWR("rawSubtitles-" + videoid, async () => (await getSubtitles(videoid)).subtitles);
    const processedSubtitles = useRef<SubtitleType[]>([]);
    const [processingJobId, setProcessingJobId] = useState<number | null>(null);
    const pollingIndexes = useRef<number[]>([]);

    const playerRef = useRef<YouTubePlayer>(null);

    const [playerError, setPlayerError] = useState<string | null>(null);

    const onPlayerReady = (event: any) => {
        playerRef.current = event.target;
    }

    const onPlayerError = (event: any) => {
        setPlayerError(event.data);
    }

    useEffect(() => {
        if (processingJobId) {
            const id = setInterval(async () => {
                try {
                    const response = await getProcessedSubtitle(processingJobId);
                    if (response.status === "completed") {
                        const newSubtitles = response.subtitles;
                        if (newSubtitles) {
                            const updatedProcessedSubtitles = [...processedSubtitles.current];
                            newSubtitles.forEach((s, i) => {
                                const originalIndex = pollingIndexes.current[i];
                                if (originalIndex !== undefined) {
                                    updatedProcessedSubtitles[originalIndex] = s;
                                }
                            });
                            processedSubtitles.current = updatedProcessedSubtitles;
                        }
                        clearInterval(id);
                        setProcessingJobId(null);
                        pollingIndexes.current = [];
                    } else if (response.status === "failed") {
                        console.error("Subtitle processing failed:", response.error);
                        // Handle failed job, maybe revert the temporary subtitles
                        const updatedProcessedSubtitles = [...processedSubtitles.current];
                        pollingIndexes.current.forEach(index => {
                            // Revert or mark as failed
                             updatedProcessedSubtitles[index] = {
                                text: [{
                                    content: rawSubtitles![index].text,
                                    meaning: ""
                                }],
                                start: rawSubtitles![index].start,
                                duration: rawSubtitles![index].duration
                             };
                        });
                        processedSubtitles.current = updatedProcessedSubtitles;

                        clearInterval(id);
                        setProcessingJobId(null);
                        pollingIndexes.current = [];
                    }
                } catch (error) {
                    console.error("Error polling for processed subtitles:", error);
                    clearInterval(id);
                    setProcessingJobId(null);
                }
            }, 3000);

            return () => {
                clearInterval(id);
                setProcessingJobId(null);
            };
        }
    }, [processingJobId, rawSubtitles]);

    useEffect(() => {
        const id = setInterval(() => {
            if (!playerRef.current || !rawSubtitles) return;
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

            let flag = false;
            for (let j = i; j < rawSubtitles.length && rawSubtitles[j].start < currentTime + 30; j++) {
                if (!processedSubtitles.current[j]) {
                    flag = true;
                    break;
                }
            }

            if (!flag) return;

            let subs_to_process = [];
            let indexes_to_process = [];
            for (let j = i; j < rawSubtitles.length && rawSubtitles[j].start < currentTime + 60; j++) {
                if (!processedSubtitles.current[j]) {
                    indexes_to_process.push(j);
                    subs_to_process.push(rawSubtitles[j]);
                    // Temporarily fill to prevent re-processing
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

            if (subs_to_process.length > 0) {
                pollingIndexes.current = indexes_to_process;
                procSubtitles(subs_to_process).then((response) => {
                    if (response.result === "success") {
                        setProcessingJobId(response.job_id);
                    }
                });
            }
        }, 50);
        return () => clearInterval(id);
    }, [playerRef.current, rawSubtitles]);

    const handleAddToFlashcard = async () => {
        if (selectedWord) {
            const response = await createFlashcard(selectedWord);
            if (response.result === "success") {
                mutateFlashcards();
            }
        }
    };

    const handleDeleteFromFlashcard = () => {
        if (selectedWord && flashcardId) {
            deleteFlashcard(flashcardId);
            mutateFlashcards();
        }
    };

    return (
        <div className="lg:flex lg:flex-row lg:gap-4 w-full lg:w-5/6 mx-auto">
            <div className="lg:max-w-1/2 w-full">
                {playerError && <p>Failed to load video. Check if the video is available.</p>}
                <YouTube videoId={videoid} onReady={onPlayerReady} onError={onPlayerError} className="w-full aspect-video" opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                        autoplay: 1,
                    }
                }}/>

                {isLoading && <p>Loading subtitles...</p>}
                {error && <p>Failed to load subtitles</p>}
                <div className="h-[100px]">
                    {subtitle.map((s, i) => <Subtitle subtitle={s} key={i} />)}
                </div>
            </div>

            <div className="lg:max-w-1/2 w-full">

                {selectedWord && (flashcardId ? <p className="text-sm text-blue-200 hover:underline" onClick={handleDeleteFromFlashcard}>{selectedWord}を単語帳から削除</p> : <p className="text-sm text-blue-200 hover:underline" onClick={handleAddToFlashcard}>{selectedWord}を単語帳に追加</p>)}
                {dict && dict.map((word, index) => <Dict word={word} key={index} />)}
            </div>
        </div>
    );
}
