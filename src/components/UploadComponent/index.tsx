'use client';

import { useCallback } from 'react';
import Script from 'next/script';

// Si no tienes tipados, declara la propiedad global en window.
declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function UploadWidget() {
  const handleUpload = useCallback(() => {
    // Crea el widget con tus opciones de configuración
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'TU_CLOUD_NAME', // Reemplaza por tu cloud name
        uploadPreset: 'TU_UPLOAD_PRESET', // Reemplaza por tu upload preset
        // Puedes agregar más opciones según la documentación:
        // folder, cropping, maxImageFileSize, etc.
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          console.log('Imagen subida exitosamente:', result.info);
          // Aquí puedes manejar la respuesta, por ejemplo, guardarla en tu estado o enviarla a tu backend
        } else if (error) {
          console.error('Error en la carga:', error);
        }
      }
    );
    widget.open(); // Abre el widget al hacer clic
  }, []);

  return (
    <div>
      <Script 
        src="https://widget.cloudinary.com/v2.0/global/all.js" 
        strategy="beforeInteractive"
      />
      <button onClick={handleUpload}>Subir imagen</button>
    </div>
  );
}
