import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center w-full mb-12">
        <p className="text-lg font-medium text-gray-500">
          La página que buscas no existe{` (todavia)`}.
        </p>
        <Image src="/not-found.png" alt="404" width={400} height={400} />
      </div>
    </div>
  );
}