'use client';

import { useCallback, useState, useEffect } from 'react';
import Script from 'next/script';
import { CloudinaryImage } from '@/interfaces/Images';

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: object,
        callback: (error: Error | null, result: { event: string; info: CloudinaryImage }) => void
      ) => { open: () => void };
    };
  }
}

interface UploadWidgetProps {
  onUploadSuccess: (image: CloudinaryImage) => void;
}

export default function UploadWidget({ onUploadSuccess }: UploadWidgetProps) {
  const [cloudinaryReady, setCloudinaryReady] = useState(false);

  useEffect(() => {
    const checkCloudinary = () => {
      if (typeof window !== 'undefined' && window.cloudinary) {
        setCloudinaryReady(true);
      }
    };

    checkCloudinary();
    window.addEventListener('cloudinary-widget-loaded', checkCloudinary);

    return () => {
      window.removeEventListener('cloudinary-widget-loaded', checkCloudinary);
    };
  }, []);

  const handleUpload = useCallback(() => {
    if (!cloudinaryReady) {
      console.error("Cloudinary no está listo.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (!error && result?.event === 'success') {
          console.log('Imagen subida exitosamente:', result.info);
          onUploadSuccess(result.info);
        } else if (error) {
          console.error('Error en la carga:', error);
        }
      }
    );
    widget.open();
  }, [onUploadSuccess, cloudinaryReady]);

  return (
    <div>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.dispatchEvent(new Event('cloudinary-widget-loaded'));
        }}
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-all duration-150"
        disabled={!cloudinaryReady} 
      >
        Subir Prenda
      </button>
    </div>
  );
}