import React from 'react';
import Image from 'next/image'; 

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">


      <div className="flex justify-center items-center text-center pt-16 pb-4 px-4 sm:px-8 md:px-16">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-5">¿Quiénes somos?</h1>
          <p className="text-lg leading-relaxed mb-5">
            Somos un equipo de seis personas apasionadas por la tecnología, que nos hemos unido para desarrollar un proyecto final de gran impacto. Cada uno de nosotros aporta habilidades únicas y complementarias que nos hacen más fuertes como grupo. Con un enfoque colaborativo y siempre dispuestos a aprender, nos enfocamos en entregar un trabajo de alta calidad, innovador y funcional.
          </p>
        </div>
      </div>


      <div className="flex justify-center items-center mb-12">
      <Image src="/sobrenosotros.png" alt="Avatar" width={900} height={1000} />
        {/* <img
          src=""
          alt="Descripción de la imagen"
          className="w-1/2 object-contain"
        /> */}
      </div>


      <div className="flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-32 mb-16">


        <div className="w-full max-w-6xl mx-auto mb-12">


          <div className="flex justify-between gap-x-12 mb-12">
            <div className="w-1/3 px-4">
              <h2 className="text-2xl font-semibold mb-3 text-left">Lucía</h2>
              <p className="text-lg leading-relaxed text-left mb-6">
                Es una experta en diseño web con una gran habilidad para cuidar los detalles visuales. Su pasión por el diseño se refleja en su trabajo, donde siempre busca la perfección en cada componente. Aporta una mirada fresca y creativa a cada proyecto.
              </p>
            </div>
            <div className="w-1/3 px-4">
              <h2 className="text-2xl font-semibold mb-3 text-left">Leo</h2>
              <p className="text-lg leading-relaxed text-left mb-6">
                Es el buen comunicador del equipo. Su habilidad para conectar y comprobar código lo convierte en un pilar fundamental para que todo funcione correctamente. Además, es el portavoz de nuestro grupo, transmitiendo nuestras ideas de manera clara y efectiva.
              </p>
            </div>
            <div className="w-1/3 px-4">
              <h2 className="text-2xl font-semibold mb-3 text-left">David</h2>
              <p className="text-lg leading-relaxed text-left mb-6">
                Es un verdadero picador de código, siempre trabajando con energía y dedicación. Se asegura de que cada línea de código esté bien escrita y optimizada. Su espíritu de colaboración y su preocupación por el bienestar del equipo lo hacen un compañero excepcional.
              </p>
            </div>
          </div>


          <div className="flex justify-between gap-x-12">
            <div className="w-1/3 px-4">
              <h2 className="text-2xl font-semibold mb-3 text-left">Ale</h2>
              <p className="text-lg leading-relaxed text-left mb-6">
                Es nuestro experto en backend. Con un gran conocimiento sobre el funcionamiento del servidor, bases de datos y despliegues, siempre nos da la calma necesaria cuando las cosas se complican. Su experiencia nos permite avanzar con confianza en los aspectos más técnicos del proyecto.
              </p>
            </div>
            <div className="w-1/3 px-4">
              <h2 className="text-2xl font-semibold mb-3 text-left">Martin</h2>
              <p className="text-lg leading-relaxed text-left mb-6">
                Es el mejor manejando la documentación y la arquitectura del backend. Siempre sabe cómo organizar y estructurar la información de manera eficiente, lo que facilita el trabajo del equipo. Su habilidad para gestionar el backend asegura que todo se mantenga en orden y bien documentado.
              </p>
            </div>
            <div className="w-1/3 px-4">
              <h2 className="text-2xl font-semibold mb-3 text-left">Maxi</h2>
              <p className="text-lg leading-relaxed text-left mb-6">
                Es una persona resolutiva y extremadamente adaptable. Su capacidad para encontrar soluciones rápidas y efectivas a los problemas técnicos ha sido crucial para el progreso del proyecto. Siempre dispuesto a enfrentarse a nuevos desafíos, es el referente de flexibilidad del equipo.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Page;