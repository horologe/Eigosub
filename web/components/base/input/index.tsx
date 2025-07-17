import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Input({className, error, label, ...props }: InputHTMLAttributes<HTMLInputElement> & {error?: string, label: string}) {
    return (
        <div className="flex flex-col">
            <label>{label}</label>
            <input {...props} className={twMerge("w-full border border-gray-300 p-2 focus:border-primary focus:outline-none", error && "border-red-500", className)}/>
            <p className="text-red-500 text-sm min-h-[20px]">{error || ""}</p>
        </div>
    );
}