"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login as loginApi } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = z.object({
    username: z.string().min(1).max(255),
    password: z.string().min(1),
});

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const {register, handleSubmit} = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        loginApi(data.username, data.password).then(response => {
            if (response.result === "success") {
                localStorage.setItem("token", response.token);
                router.push("/");
            } else {
                setError(response?.error ?? "Unknown error");
            }
        });
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Username" {...register("username")} />
                <input type="password" placeholder="Password" {...register("password")} />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}