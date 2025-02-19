import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-zinc-50 text-gray-700 mt-auto py-8">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              Sobre nosotros
            </h4>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              Accesos rápidos
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-sm text-gray-700 hover:text-cyan-500 transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/products"
                className="text-sm text-gray-700 hover:text-cyan-500 transition-colors"
              >
                Términos y condiciones
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              Soporte
            </h4>
            <div className="text-sm space-y-2">
              <p>Dirección:</p>
              <p>Teléfono:</p>
              <p aria-label="Email">
                <a
                  href="mailto:info@imagoargentina.com"
                  className="text-cyan-500 hover:text-cyan-300 transition-colors"
                >
                  info@email.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center items-start space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              Síguenos
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/tu-pagina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-cyan-500 transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://www.twitter.com/tu-pagina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-cyan-500 transition-colors"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://www.instagram.com/tu-pagina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-cyan-500 transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.linkedin.com/tu-pagina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-cyan-500 transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} myCloset 2025. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
