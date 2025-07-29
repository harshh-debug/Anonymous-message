import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "UnseenNote",
  description: "User dashboard for anonymous messaging",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-gray-950/50 via-gray-950 to-gray-950/80">
        {children}
      </main>
    </div>
  );
}