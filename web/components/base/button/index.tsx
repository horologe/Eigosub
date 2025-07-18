import { twMerge } from "tailwind-merge";
import "./style.css";
import { useRef } from "react";

export type ButtonProps = {
    children: React.ReactNode,
    className?: string,
    onClick?: () => void,
    variant: "primary" | "text",
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({children, className, variant, ...props}: ButtonProps) {
    const ref = useRef<HTMLButtonElement>(null)

    const variantClass = {
        primary: "border border-primary primary-btn",
        text: "border-none hover:underline",
    }[variant];

    return (
        <button {...props} ref={ref} onMouseMove={(e) => {
            if (ref.current) {
                ref.current.style.setProperty("--x", `${e.clientX - ref.current.getBoundingClientRect().left}px`)
                ref.current.style.setProperty("--y", `${e.clientY - ref.current.getBoundingClientRect().top}px`)
            }
        }} className={twMerge("w-full p-2", variantClass, className)}><span>{children}</span></button>
    );
}