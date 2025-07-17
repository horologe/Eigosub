import { twMerge } from "tailwind-merge";

export default function Button({children, className, ...props}: {children: React.ReactNode, className?: string} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} className={twMerge("w-full border border-gray-300 p-2 active:border-primary", className)}>{children}</button>
    );
}