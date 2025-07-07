import type { Metadata } from "next";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: "Eigosub",
  description: "Eigosub is a brand new app for Japanese English learner using all youtube videos you like.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black dark:text-white">
        {children}
      </body>
    </html>
  );
}
