'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  
import Swal from 'sweetalert2';

const Accepted = () => {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      title: '¡Pago Aceptado!',
      text: 'Muchas gracias por confiar en myCloset y efectuar tu compra.',
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonText: 'Salir',

      willClose: () => router.push('/mycloset')
    });


    const timer = setTimeout(() => {
      router.push('/mycloset');
    }, 6000);

    return () => clearTimeout(timer);
  }, [router]);

  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
  //     <div className="text-center">
  //       <h1 className="text-4xl font-semibold">¡Pago Aceptado!</h1>
  //       <p className="mt-4 text-lg">Gracias por tu compra. ¡Disfruta de tu experiencia con nosotros!</p>
  //     </div>
  //   </div>
  // );
};

export default Accepted;