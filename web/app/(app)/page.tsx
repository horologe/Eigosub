"use client";
import { me as meApi } from "@/services/api";
import { useEffect, useState } from "react";
import { MeResponse } from "@/model/api";
import Link from "next/link";

export default function Home() {
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
    <div>
      <h1>Welcome to Eigosub</h1>
      {me && <p> Hello, {me.user.username}</p>}
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      <Link href="/logout">Logout</Link>
    </div>
  );
}
