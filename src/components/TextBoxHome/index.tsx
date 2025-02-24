"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TextBoxHome() {
  const [showSecondMessage, setShowSecondMessage] = useState(false);
  const [showThirdMessage, setShowThirdMessage] = useState(false);
  const [showFourthMessage, setShowFourthMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondMessage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowThirdMessage(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFourthMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <div className="align-middle flex flex-col items-center justify-center">
    </div>
    <div
      className="
        absolute
        top-20
        right-20
        flex
        flex-col
        items-end
        gap-8
      "
    >
      <div
        className="
          bg-amber-300
          text-white
          mr-32
          px-8
          py-4
          rounded-lg
          shadow-lg
          animate-slideFromRight
          max-w-sm
          text-xl
          font-semibold
        "
      >
        ¿Y hoy, qué me pongo? 🤔
      </div>

      {showSecondMessage && (
        <>
        <div
          className="
            bg-cyan-500
            text-white
            -mr-4
            px-8
            py-4
            rounded-lg
            shadow-lg
            animate-slideFromRight
            max-w-sm
            text-xl
            font-semibold
          "
        >
          myCloset lo resuelve 😎
        </div>
        </>
      )}

      {showThirdMessage && (
              <div
              className="
                bg-amber-300
                text-white
                mr-32
                px-8
                py-4
                rounded-lg
                shadow-lg
                animate-slideFromRight
                max-w-sm
                text-xl
                font-semibold
              "
            >
              Genial! Por donde empiezo?
            </div>
          )}

          {showFourthMessage && (
                  <div
                  className="
                    bg-cyan-500
                    text-white
                    -mr-4
                    px-8
                    py-4
                    rounded-lg
                    shadow-lg
                    animate-slideFromRight
                    max-w-sm
                    text-xl
                    font-semibold
                  "
                >
                Antes que nada, <Link href='/signup'>
                regístrate</Link>🚀
                </div>
              )}
    </div>
    </>
  );
}
