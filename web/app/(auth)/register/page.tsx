"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register as registerApi } from "@/services/api";
import Button from "@/components/base/button";
import Input from "@/components/base/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
    username: z.string().min(1, {message: "Username is required"}).max(255, {message: "Username is too long"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
});

export default function RegisterPage() {
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}, setError} = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        registerApi(data.username, data.password).then(response => {
            if (response.result === "success") {
                router.push("/login");
            }
        }).catch(error => {
            for (const key in error.response.data.error) {
                setError(key as any, {message: error.response.data.error[key]});
            }
        });
    }

    return (
        <div className="flex flex-col gap-y-10 items-center justify-center h-screen mx-auto w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full gap-y-2 flex flex-col">
                <h1 className="text-2xl font-bold text-primary text-center">Register</h1>
                <div className="flex flex-col w-full">
                    <Input type="text" placeholder="tokushige" {...register("username")} label="Username" error={errors.username?.message}/>
                </div>
                <div className="flex flex-col w-full">
                    <Input type="password" placeholder="Password" {...register("password")} label="Password" error={errors.password?.message}/>
                </div>
                <Button type="submit" className="mt-2" variant="primary">Register</Button>
                <Link href="/login">
                    <Button variant="text">Login</Button>
                </Link>
            </form>
        </div>  
    );
}