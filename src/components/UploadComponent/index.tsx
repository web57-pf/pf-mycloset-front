'use client';

import { useCallback } from 'react';
import Script from 'next/script';
import { CloudinaryImage } from '@/interfaces/Images';

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface UploadWidgetProps {
  onUploadSuccess: (image: CloudinaryImage) => void;
}

export default function UploadWidget({ onUploadSuccess }: UploadWidgetProps) {
  const handleUpload = useCallback(() => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dpsbwrjjc', 
        uploadPreset: 'Clothe', 
      },
      (error: any, result: any): void => {
        if (!error && result && result.event === 'success') {
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
      />
      <button 
      onClick={handleUpload}
      className="px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-all duration-150"
      >Subir Prenda
      </button>
    </div>
  );
}
