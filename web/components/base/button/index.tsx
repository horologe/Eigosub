import { twMerge } from "tailwind-merge";

export default function Button({children, className, ...props}: {children: React.ReactNode, className?: string} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button className={twMerge("bg-secondary text-black rounded-md px-4 py-2 h-10 font-bold", className)} {...props}>{children}</button>
}