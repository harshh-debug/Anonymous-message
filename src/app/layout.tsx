import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "True Feedback",
  description: "Anonymous Messaging Platform",
  metadataBase: new URL("https://truefeedback.app"),
  openGraph: {
    images: "/og-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black scroll-smooth">
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-gray-100`}>
          {children}
          {/* Single Toaster instance for entire app */}
          <Toaster 
            theme="dark"
            position="top-right"
            richColors
            toastOptions={{
              classNames: {
                toast: '!bg-gray-900 !border !border-gray-800',
                title: '!text-gray-100',
                description: '!text-gray-400',
                success: '!border-green-900/30',
                error: '!border-red-900/30',
                actionButton: '!bg-gray-800 hover:!bg-gray-700',
                cancelButton: '!bg-gray-900 hover:!bg-gray-800',
              },
            }}
          />
        </body>
      </AuthProvider>
    </html>
  );
}