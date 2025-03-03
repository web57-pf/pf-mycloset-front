import Link from "next/link";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa"; 

export const Footer = () => {
  return (
    <footer className="bg-[#C3DEF4] p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-start">
        <div className="flex flex-col space-y-4">
          <span className="text-lg font-semibold text-gray-800">Enlaces</span>
          <div className="flex flex-col space-y-2">
            <Link href="/mycloset">
            <span className="text-sm text-gray-700 hover:text-blue-500">Mi Armario</span>
            </Link>
            <Link href="/sobrenosotros">
            <span className="text-sm text-gray-700 hover:text-blue-500">Sobre Nosotros</span>
            </Link>
            <Link href="/contact">
            <span className="text-sm text-gray-700 hover:text-blue-500">Contacto</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <span className="text-lg font-semibold text-gray-800">Redes Sociales</span>
          <div className="flex justify-center space-x-4">
            <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <span>
              <FaInstagram 
                className="text-xl text-gray-600 cursor-pointer hover:text-[#E4405F]" 
              />
            </span>
            </Link>
            <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <span>
              <FaFacebook 
                className="text-xl text-gray-600 cursor-pointer hover:text-blue-600" 
              />
            </span>
            </Link>
            <Link
              href="https://wa.me/1234567890?text=Hola!%20Quisiera%20obtener%20más%20información." 
              target="_blank" 
              rel="noopener noreferrer">
            <span>
              <FaWhatsapp 
                className="text-xl text-gray-600 cursor-pointer hover:text-green-500" 
              />
            </span>
              </Link>
          </div>
        </div>
          <div className="flex flex-col space-y-4">
          <span className="text-lg font-semibold text-gray-800">Información</span>
          <div className="flex flex-col space-y-2">
            <Link href="/faq">
            <span className="text-sm text-gray-700 hover:text-blue-500">Preguntas Frecuentes</span>
            </Link>
            <Link href="/support">
            <span className="text-sm text-gray-700 hover:text-blue-500">Soporte al Cliente</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-700">
        <p>© 2025 Mi Proyecto. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;