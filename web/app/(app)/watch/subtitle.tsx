import { useState } from "react";
import { useSelectedWordStore } from "@/hooks/selected-word";
import { Subtitle as SubtitleType } from "@/model/api";

export type SubtitleProps = {
    subtitle: SubtitleType;
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
    if (currentWord) words.push(currentWord);
    return words;
}



export default function Subtitle({ subtitle }: SubtitleProps) {
    const { setSelectedWord } = useSelectedWordStore();

    return (
        <div className="w-[640px] text-center">
            {subtitle.text.map((text, index1) => {
                const isMeaning = text.meaning !== "";
                const textHtml = getWords(text.content).map((word, index2) => 
                
                    <span key={`${index1}-${index2}`} onClick={() => {
                        if (!separators.includes(word))
                        setSelectedWord(word);
                    }} className={"text-center text-lg font-medium text-gray-900 subpixel-antialiased dark:text-white w-100 " + (separators.includes(word) ? "" :  "hover:border-primary hover:border-b-4 hover:bg-primary/40")}>
                        {word}
                    </span>
                );
                if (isMeaning) {
                    return <ruby key={index1}>{textHtml}<rp>(</rp><rt className="text-base">{text.meaning}</rt><rp>)</rp></ruby>;
                } else {
                    return textHtml;
                }
            })}
        </div>
    );
}