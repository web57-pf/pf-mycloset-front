import Image from "next/image";

export default function Armario() {
    return (
        <div className="flex flex-col items-center justify-start min-h-screen">
            <Image src="/armario.png" alt="armario" width={500} height={500} />
            <h2 className="text-center text-black text-4xl font-light">
                nada por aquí, nada por allá...
            </h2>
        </div>
    );
}