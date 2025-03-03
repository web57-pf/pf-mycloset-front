'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  
import Swal from 'sweetalert2';

const Denied = () => {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      title: '¡Pago Denegado!',
      text: 'Lamentablemente, tu pago no ha sido procesado correctamente. Por favor, intenta de nuevo.',
      icon: 'error',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonText: 'Volver a intentar',
      
      willClose: () => router.push('/tarifas') 
    });

    
    const timer = setTimeout(() => {
      router.push('/checkout'); 
    }, 6000);

    return () => clearTimeout(timer);
  }, [router]);

  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
  //     <div className="text-center">
  //       <h1 className="text-4xl font-semibold">¡Pago Denegado!</h1>
  //       <p className="mt-4 text-lg">Lamentablemente, tu pago no ha sido procesado correctamente. Por favor, intenta de nuevo.</p>
  //     </div>
  //   </div>
  // );
};

export default Denied;