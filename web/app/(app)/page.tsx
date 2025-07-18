"use client";
import { createFlashcard, deleteFlashcard, getFlashcards, me as meApi } from "@/services/api";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Button from "@/components/base/button";
import { useState } from "react";
import Flashcard from "./flashcrad";

export default function Home() {
  const { data: me, error: meError, isLoading: meIsLoading } = useSWR("me", meApi);
  const { register, handleSubmit, reset } = useForm();
    const { data, error, isLoading, mutate } = useSWR("flashcards", getFlashcards);
    const flashcards = data?.flashcards || [];
    const onSubmit = (data: any) => {
        const { content } = data;
        createFlashcard(content).then(() => mutate());
        reset();
    };

    const [currentPage, setCurrentPage] = useState(0);
    

    if (error || meError) return <div>Error</div>;
    if (isLoading || meIsLoading) return <div>Loading...</div>;

    const handleNext = () => {
        if (currentPage < flashcards.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-2xl font-bold text-center">Hello, {me?.user.username}</h1>
      {flashcards.length > currentPage ? (
      <div className="flex flex-row gap-x-2 grid-cols-subgrid w-full items-center justify-center">
        <div>
          <Button variant="primary" onClick={handlePrevious} disabled={currentPage === 0}>{"<"}</Button>
        </div>
        <div className="border-2 border-gray-700 p-2 w-xl">
          <Flashcard flashcard={flashcards[currentPage]} />
        </div>
        <div>
          <Button variant="primary" onClick={handleNext} disabled={currentPage === flashcards.length - 1}>{">"}</Button>
          </div>
        </div>
      ) : (
        <div className="text-center ">No flashcards</div>
      )}
    </div>
  );
}
