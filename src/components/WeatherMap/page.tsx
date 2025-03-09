'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
}

const WeatherMap = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          setPosition([latitude, longitude]);
          fetchWeather(latitude, longitude);
        },
        (error) => console.error('Error obteniendo la ubicación:', error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/weather?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error('Error obteniendo el clima');
      const data = await response.json();

      const weatherData: WeatherData = {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };

      setWeather(weatherData);
    } catch (error) {
      console.error(error);
    }
  };

  const SetMapView = ({ position }: { position: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, 13);
        map.scrollWheelZoom.enable();
      }
    }, [position, map]);

    return null;
  };

  return (
    <div className="h-screen w-full">
      {position ? (
        <MapContainer style={{ height: '100%', width: '100%' }}>
          <SetMapView position={position} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>
              {weather ? (
                <div>
                  <p>Temperatura: {weather.temp}°C</p>
                  <p>Sensación Térmica: {weather.feels_like}°C</p>
                  <p>Condición: {weather.description}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
                    alt={weather.description}
                    className="w-8 h-8"
                  />
                </div>
              ) : (
                <p>Cargando clima...</p>
              )}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Obteniendo ubicación...</p>
      )}
    </div>
  );
};

export default WeatherMap;
