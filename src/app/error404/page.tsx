import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">

      <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-md"></div>


      <Link href="/" className="absolute top-6 left-6 p-2 rounded-full bg-white/70 dark:bg-black/50 hover:bg-white dark:hover:bg-black shadow-lg transition z-10">
        <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
      </Link>


      <div className="relative z-10">
        <Image src="/error404caro.png" alt="Error 404" width={1200} height={1200} className="max-w-full h-auto" />
      </div>
    </div>
  );
}
