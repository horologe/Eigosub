import { useState } from "react";
import { useSelectedWordStore } from "@/hooks/selected-word";

export type SubtitleProps = {
    subtitle: string;
}

const separators = ["\n", ":", ",", ".", "!", "?", " "];

function getWords(subtitle: string): string[]{
    const words: string[] = [];

    let currentWord = "";
    for (const char of subtitle) {
        if (separators.includes(char)) {
            words.push(currentWord);
            currentWord = "";
            words.push(char);
        } else {
            currentWord += char;
        }
    }
    return words;
}

export default function Subtitle({ subtitle }: SubtitleProps) {
    const words = getWords(subtitle);
    const { selectedWord, setSelectedWord } = useSelectedWordStore();



    return (
        <div className="w-[640px] text-center">
            {words.map((word, index) => {
                return (
                    <span key={index} onClick={() => {
                        setSelectedWord(word);
                        console.log(word);  
                    }} className={"text-center text-lg font-medium text-gray-900 subpixel-antialiased dark:text-white w-100 " + (separators.includes(word) ? "" :  "hover:border-primary hover:border-b-4 hover:bg-primary/40")}>
                        {word}
                    </span>
                );
            })}
        </div>
    );
}