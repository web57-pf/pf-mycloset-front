import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa"; 

export const Navbar = () => {
  return (
    <nav>
      <div className="bg-[#C3DEF4] flex justify-between items-center p-4">
        <div className="flex space-x-4">
          <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <FaInstagram 
              className="text-xl text-gray-600 cursor-pointer hover:text-[#E4405F]"
            />
          </Link>
          <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <FaFacebook 
              className="text-xl text-gray-600 cursor-pointer hover:text-blue-600" 
            />
          </Link>
          <Link
            href="https://wa.me/1234567890?text=Hola!%20Quisiera%20obtener%20más%20información." 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaWhatsapp 
              className="text-xl text-gray-600 cursor-pointer hover:text-green-500" 
            />
          </Link>
        </div>

        <div className="flex space-x-6 bg">
          <Link href="/login">
          <span className="text-sm text-black cursor-pointer hover:text-blue-500 transition-all duration-150">Iniciar sesión</span>
          </Link>
          <Link href="/signup">
          <span className="text-sm text-black cursor-pointer hover:text-blue-500 transition-all duration-150">Registrarse</span>
          </Link>
        </div>
      </div>

      <div className="flex justify-center items-center p-4 bg-transparent hover:bg-[#FFF8F1]">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={200} height={200} />
        </Link>

        <div className="flex p-4 space-x-6">
          <Link href="/mycloset">
          <span className="text-sm text-gray-700 cursor-pointer hover:text-blue-500 transition-all duration-150">Mi Armario</span>
          </Link>
          <Link href="/aboutus">
          <span className="text-sm text-gray-700 cursor-pointer hover:text-blue-500 transition-all duration-150">Sobre Nosotros</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;