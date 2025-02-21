'use client'

import Script from "next/script";
import UploadWidget from "../UploadComponent";

export default function Dashboard() {
    return (
        <>
        <Script 
        src="https://widget.cloudinary.com/v2.0/global/all.js" 
        strategy="beforeInteractive"
      />
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1>Dashboard</h1>

            <div>
                <UploadWidget />
            </div>
        </div>
        </>
    );
}