"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function getVideoId(url: string) {
    const videoId = url.split("v=")[1];
    return videoId;
}

export default function Searchbar() {
    const [url, setUrl] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/watch?v=${getVideoId(url)}`);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div  className="rounded-full p-3 dark:bg-secondary text-lg w-lg focus:outline-2 focus:outline-secondary/80 focus:border-none h-12 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=z4K2F_OALPQ" className="w-full h-full outline-none"/>
                </div>
            </form>
        </div>
    )
}