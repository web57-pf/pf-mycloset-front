'use client';

import dynamic from 'next/dynamic';

const WeatherMap = dynamic(() => import('@/components/WeatherMap/page'), { 
  ssr: false 
});

export default function GpsPage() {
  return (
    <div>
      <h1>Mapa de Clima</h1>
      <WeatherMap />
    </div>
  );
}
