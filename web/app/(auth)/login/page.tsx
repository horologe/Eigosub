"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login as loginApi } from "@/services/api";
import { useRouter } from "next/navigation";
import Input from "@/components/base/input";
import Button from "@/components/base/button";
import Link from "next/link";

const schema = z.object({
    username: z.string().min(1).max(255),
    password: z.string().min(1),
});

export default function LoginPage() {
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}, setError} = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        loginApi(data.username, data.password).then(response => {
            if (response.result === "success") {
                localStorage.setItem("token", response.token);
                router.push("/");
            }
        }).catch(error => {
            setError("root", {message: error.response.data.error});
        });
    }

    return (
        <div className="flex flex-col gap-y-10 items-center justify-center h-screen mx-auto w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full gap-y-2 flex flex-col">
                <h1 className="text-2xl font-bold text-primary text-center">Login</h1>
                <div className="flex flex-col w-full">
                    <Input type="text" placeholder="tokushige" {...register("username")} label="Username" error={errors.root?.message}/>
                </div>
                <div className="flex flex-col w-full">
                    <Input type="password" placeholder="Password" {...register("password")} label="Password" error={errors.root?.message}/>
                </div>
                <Button type="submit" className="mt-2">Login</Button>
                <Link href="/register">
                    <Button className="border-none hover:underline hover:border-2 hover:text-primary">Register</Button>
                </Link>
            </form>
        </div>  
    );
}