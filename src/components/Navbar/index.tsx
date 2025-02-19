import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";

export default async function Navbar() {
  return (
    <nav
      className="
        w-full
        relative
        border-b border-gray-300
        box-border
        flex flex-row items-center justify-between
        px-8
        bg-zinc-50 text-black
        transition-colors duration-200 ease-in-out
        hover:bg-gray-100
      "
    >
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center p-4">
            <Image
              src="/logo.png"
              width={200}
              height={200}
              alt="Logo"
              className="object-contain"
            />
          </div>
        </Link>
      </div>
      <ul className="flex flex-row items-center gap-4 p-4">
        <li className="font-light hover:text-[#3f6d9e] transition-all duration-200 ease-in-out">
            <Link href="/">
            <FaUser className="text-xl"/>
            </Link>
        </li>
      </ul>
    </nav>
  );
}
