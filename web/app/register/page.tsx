"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register as registerApi } from "@/services/api";

const schema = z.object({
    username: z.string().min(1).max(255),
    password: z.string().min(1),
});

export default function RegisterPage() {
    const {register, handleSubmit} = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        registerApi(data.username, data.password).then(response => {
            if (response.result === "success") {
                console.log(response);
            }
        });
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Username" {...register("username")} />
                <input type="password" placeholder="Password" {...register("password")} />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}