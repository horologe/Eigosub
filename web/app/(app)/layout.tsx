import type { Metadata } from "next";
import "@/styles/global.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Eigosub",
  description: "Eigosub is a brand new app for Japanese English learner using all youtube videos you like.",
};

export default function AppsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
