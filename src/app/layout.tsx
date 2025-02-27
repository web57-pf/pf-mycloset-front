import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import DeepSeekChatbot from "@/components/ChatBot";
import { AuthProvider } from "@/contexts/authContext";


export const metadata: Metadata = {
  title: "myCloset",
  description: "myCloset 2025.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-orange-50 text-black">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <DeepSeekChatbot />
        <Footer />
      </body>
    </html>
    </AuthProvider>
  );
}
