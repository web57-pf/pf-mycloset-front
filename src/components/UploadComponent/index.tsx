'use client';

import { useCallback, useEffect, useState } from 'react';
import Script from 'next/script';
import { CloudinaryImage } from '@/interfaces/Images';

declare global {
  interface Window {
    cloudinary?: Cloudinary;
  }
}

interface Cloudinary {
  createUploadWidget: (
    options: { cloudName: string; uploadPreset: string },
    callback: (error: Error | null, result?: CloudinaryUploadResult) => void
  ) => { open: () => void };
}

interface CloudinaryUploadResult {
  event: string;
  info?: CloudinaryImage;
}

interface UploadWidgetProps {
  onUploadSuccess: (image: CloudinaryImage) => void;
}

export default function UploadWidget({ onUploadSuccess }: UploadWidgetProps) {
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.cloudinary) {
      setIsWidgetLoaded(true);
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (!window.cloudinary) {
      console.error('Cloudinary no está disponible.');
      return;
    }
    setIsUploading(true);
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      },
      (error: Error | null, result?: CloudinaryUploadResult): void => {
        if (!error && result) {
          if (result.event === 'success' && result.info) {
            console.log('Imagen subida exitosamente:', result.info);
            onUploadSuccess(result.info);
          } else if (result.event === 'close') {
            console.log("Widget cerrado sin subir imagen");
          }
        } else if (error) {
          console.error('Error en la carga:', error);
        }
        setIsUploading(false);
      }
    );
    widget.open();
  }, [onUploadSuccess]);

  return (
    <div>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="afterInteractive"
        onLoad={() => setIsWidgetLoaded(true)}
      />
      {!isWidgetLoaded ? (
        <div className="flex justify-center items-center h-full">
          <span>Cargando widget...</span>
        </div>
      ) : (
        <button 
          onClick={handleUpload}
          className="px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-all duration-150"
          disabled={isUploading}
        >
          {isUploading ? "Subiendo..." : "Cargar Prenda"}
        </button>
      )}
    </div>
  );
}
