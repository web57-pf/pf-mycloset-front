'use client'

import Script from "next/script";
import UploadWidget from "../UploadComponent";
import { CloudinaryImage } from "@/interfaces/Images";
import Image from "next/image";

interface DashboardProps {
    onUploadSuccess: (image: CloudinaryImage) => void;
}

export default function Dashboard({ onUploadSuccess }: DashboardProps) {
    return (
        <>
          <Script
            src="https://widget.cloudinary.com/v2.0/global/all.js"
            strategy="beforeInteractive"
          />
          <div className="flex flex-col justify-center items-center min-h-screen p-4">
            <h1 className="text-3xl font-normal mb-6">Bienvenido/a {`user`}👋</h1>
            <div className="mb-8">
              <UploadWidget onUploadSuccess={onUploadSuccess} />
            </div>
          </div>
        </>
      );
    }