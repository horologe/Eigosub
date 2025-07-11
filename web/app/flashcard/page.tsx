"use client";
import useSWR from "swr";
import { createFlashcard, getFlashcards } from "@/services/api";
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
            <div key={card.id}>{card.content}</div>
        ))}
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register("content")} />
            <button type="submit">Add</button>
        </form>
    </div>;
}