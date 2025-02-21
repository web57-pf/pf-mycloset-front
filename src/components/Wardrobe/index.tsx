'use client'
import { CloudinaryImage } from "@/interfaces/Images";
import Armario from "../WDAnimation";
import Image from "next/image";

interface WardrobeProps {
    images: CloudinaryImage[];
}

export default function Wardrobe({ images }: WardrobeProps) {
    return (
        <div className="p-4">
          {images.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="border p-2">
                  <Image
                    src={image.secure_url}
                    alt={`Prenda ${index + 1}`}
                    className="w-full h-auto object-cover"
                    width={image.width}
                    height={image.height}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Armario />
          )}
        </div>
      );
}