"use client";

import Image from "next/image";
import Searchbar from "./searchbar";
import { MeResponse } from "@/model/api";
import { logout, me as meApi } from "@/services/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/base/button";

function LoginButton() {
    return <Link href="/login" className="hover:underline hover:text-primary">Login</Link>
}

function LogoutButton() {
    return <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
    }} className="hover:underline hover:text-primary">Logout</button>;
}

export default function Header() {
    const [me, setMe] = useState<MeResponse | null>(null);
    useEffect(() => {
      meApi().then(response => {
        if (response.result === "success" && response.user) {
          setMe(response);
        } else {
          setMe(null);
        }
      }).catch(()=>{});
    }, []);

    return (
        <header className="flex justify-between items-center p-4 w-100% h-[70px] border-b border-primary mb-2">
            <div className="flex items-center gap-2">
                <Link href="/"><Image src="/logo.png" alt="Eigosub" width={384/3} height={140/3} className="h-auto w-auto"/></Link>
            </div>

            <Searchbar />

            <div className="flex items-center gap-2">
                {me ? <LogoutButton /> : <LoginButton />}
            </div>
        </header>
    )
}