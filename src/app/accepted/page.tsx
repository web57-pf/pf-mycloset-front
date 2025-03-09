'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/authContext';

const Accepted = () => {
  const router = useRouter();
  const { refreshUser } = useAuth(); 

  useEffect(() => {
    const updateUserSession = async () => {
      await refreshUser(); // Forzar la actualización de la sesión
    };

    updateUserSession().then(() => {
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

      // Asegurar que el usuario tenga tiempo de actualizarse antes de redirigir
      setTimeout(() => {
        router.push('/mycloset');
      }, 6000);
    });
  }, [router, refreshUser]);

  return null;
};

export default Accepted;
