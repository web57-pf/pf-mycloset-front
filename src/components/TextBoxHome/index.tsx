"use client";

import { useEffect, useState } from "react";

export default function TextBoxHome() {
  const [showSecondMessage, setShowSecondMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondMessage(true);
    }, 2000);

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
        gap-4
      "
    >
      <div
        className="
          bg-amber-300
          text-white
          px-6
          py-4
          rounded-lg
          shadow-lg
          animate-slideFromRight
          max-w-sm
          text-xl
          font-semibold
        "
      >
        ¿Y hoy, qué me pongo?
      </div>

      {showSecondMessage && (
        <>
        <div
          className="
            bg-cyan-500
            text-white
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
    </div>
    </>
  );
}
