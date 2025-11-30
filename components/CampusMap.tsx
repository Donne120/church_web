'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface University {
  id: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
}

interface CampusMapProps {
  universities: University[];
}

export default function CampusMap({ universities }: CampusMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = token;

    // Initialize map centered on Rwanda
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [30.0619, -1.9706], // Kigali coordinates
      zoom: 8,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded || universities.length === 0) return;

    // Add markers for each university
    universities.forEach((uni) => {
      if (!uni.lat || !uni.lng) return;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'campus-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#0D2B66';
      el.style.border = '3px solid #FFB703';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <h3 style="font-weight: bold; margin-bottom: 4px; color: #0D2B66;">${uni.name}</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">
            ${uni.city ? `${uni.city}, ` : ''}${uni.region}
          </p>
        </div>
      `);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([uni.lng, uni.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Fit map to show all markers
    if (universities.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      universities.forEach((uni) => {
        if (uni.lat && uni.lng) {
          bounds.extend([uni.lng, uni.lat]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    }
  }, [mapLoaded, universities]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[500px] rounded-lg shadow-lg"
      style={{ minHeight: '500px' }}
    />
  );
}








