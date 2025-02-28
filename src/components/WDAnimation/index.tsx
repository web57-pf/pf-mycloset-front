import Image from "next/image";

export default function Armario() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image src="/armario.png" alt="armario" width={400} height={400} />
        </div>
    );
}