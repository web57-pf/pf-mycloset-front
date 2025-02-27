'use client';

import { useCallback, useState } from 'react';
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

  const handleUpload = useCallback(() => {
    if (!window.cloudinary) {
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
  }, [onUploadSuccess]);

  return (
    <div>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="beforeInteractive"
        onLoad={() => setCloudinaryReady(true)}
      />
      <button 
        onClick={handleUpload}
        disabled={!cloudinaryReady}
        className={`px-4 py-2 rounded-full transition-all duration-150 ${cloudinaryReady ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-gray-400 text-gray-300 cursor-not-allowed'}`}
      >
        {cloudinaryReady ? 'Cargar Prenda' : 'Cargando...'}
      </button>
    </div>
  );
}
