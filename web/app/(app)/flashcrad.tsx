import { Flashcard as FlashcardType } from "@/model/api";
import useSWR, { mutate } from "swr";
import { deleteFlashcard, getDict } from "@/services/api";
import { WordEntry } from "@/model/dict";
import Link from "next/link";
import { useState } from "react";

export default function Flashcard({flashcard}: {flashcard: FlashcardType}) {

    const { data: dict, error: dictError } = useSWR("dict-" + flashcard.content, () => getDict(flashcard.content).then((response) => response.dict));
    const [revealMeanings, setRevealMeanings] = useState(false);

    const handleDelete = () => {
        deleteFlashcard(flashcard.id);
        mutate("flashcards");
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">{flashcard.content}</h1>
            <p onClick={handleDelete} className="text-sm text-red-600 hover:underline cursor-pointer">フラッシュカードを削除</p>
            <hr className="mt-2 mb-2"/>
            {dict?.map((item: WordEntry) => (
                <div key={item.word} className={`${revealMeanings ? "" : "blur"}`}  onClick={() => setRevealMeanings(!revealMeanings)}>
                    {item.translation && <p>{item.translation.join(", ")}</p>}
                </div>
            ))}
        </div>
    );
}   