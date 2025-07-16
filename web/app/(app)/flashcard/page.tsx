"use client";
import useSWR from "swr";
import { createFlashcard, deleteFlashcard, getFlashcards } from "@/services/api";
import { Flashcard } from "@/model/api";
import { useForm } from "react-hook-form";

export default function FlashcardPage() {
    const { register, handleSubmit, reset } = useForm();
    const { data, error, isLoading, mutate } = useSWR("flashcards", getFlashcards);
    const onSubmit = (data: any) => {
        const { content } = data;
        createFlashcard(content).then(() => mutate());
        reset();
    };

    if (error) return <div>Error</div>;
    if (isLoading) return <div>Loading...</div>;

    return <div>
        {data?.flashcards.map((card: Flashcard) => (
            <div key={card.id} className="flex items-center gap-2">
                <p className="text-lg">{card.content}</p>
                <button onClick={() => deleteFlashcard(card.id).then(() => mutate())} className="bg-red-500 text-white px-2 py-1 rounded-md">Delete</button>
            </div>
        ))}
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register("content")} />
            <button type="submit">Add</button>
        </form>
    </div>;
}