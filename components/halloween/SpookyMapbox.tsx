/**
 * SpookyMapbox Component
 * 
 * Interactive Mapbox map with dark Halloween style and animations.
 * Features: pulsing marker, fog effect, spooky styling.
 */

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface SpookyMapboxProps {
  latitude: number;
  longitude: number;
  name: string;
  className?: string;
  showPulse?: boolean;
}

export const SpookyMapbox: React.FC<SpookyMapboxProps> = ({
  latitude,
  longitude,
  name,
  className = 'w-full h-48',
  showPulse = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [longitude, latitude],
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });

    map.current.on('load', () => {
      if (!map.current) return;
      setMapLoaded(true);

      // Add fog effect for spooky atmosphere
      map.current.setFog({
        color: 'rgb(26, 10, 46)', // deepPurple
        'high-color': 'rgb(13, 27, 42)', // midnightBlue
        'horizon-blend': 0.4,
        'space-color': 'rgb(10, 5, 20)',
        'star-intensity': 0.8,
      });

      // Add pulsing dot source
      map.current.addSource('pulse-point', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          properties: {},
        },
      });

      // Outer pulse ring
      map.current.addLayer({
        id: 'pulse-ring',
        type: 'circle',
        source: 'pulse-point',
        paint: {
          'circle-radius': 30,
          'circle-color': 'rgba(255, 107, 53, 0.3)',
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(255, 107, 53, 0.6)',
        },
      });

      // Inner marker
      map.current.addLayer({
        id: 'pulse-center',
        type: 'circle',
        source: 'pulse-point',
        paint: {
          'circle-radius': 10,
          'circle-color': '#ff6b35',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Animate pulse
      let pulseSize = 30;
      let growing = true;
      const animatePulse = () => {
        if (!map.current) return;

        if (growing) {
          pulseSize += 0.5;
          if (pulseSize >= 50) growing = false;
        } else {
          pulseSize -= 0.5;
          if (pulseSize <= 30) growing = true;
        }

        map.current.setPaintProperty('pulse-ring', 'circle-radius', pulseSize);
        map.current.setPaintProperty(
          'pulse-ring',
          'circle-color',
          `rgba(255, 107, 53, ${0.4 - (pulseSize - 30) * 0.01})`
        );

        requestAnimationFrame(animatePulse);
      };

      if (showPulse) {
        animatePulse();
      }

      // Add 3D buildings for atmosphere
      const layers = map.current.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      if (labelLayerId) {
        map.current.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 12,
            paint: {
              'fill-extrusion-color': '#1a0a2e',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.7,
            },
          },
          labelLayerId
        );
      }
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    // Slow rotation animation
    let rotationAngle = -17.6;
    const rotateCamera = () => {
      if (!map.current) return;
      rotationAngle += 0.05;
      map.current.rotateTo(rotationAngle % 360, { duration: 0 });
      requestAnimationFrame(rotateCamera);
    };
    // Uncomment for continuous rotation:
    // rotateCamera();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, name, showPulse]);

  // Fallback if no Mapbox token
  if (!MAPBOX_TOKEN) {
    return (
      <div className={`${className} bg-deepPurple/50 flex items-center justify-center rounded-xl`}>
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl mb-2"
          >
            📍
          </motion.div>
          <p className="text-ghostlyWhite/70 text-sm">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
          <p className="text-pumpkinOrange text-xs mt-1">{name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} rounded-xl overflow-hidden`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-deepPurple/80 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-3xl"
          >
            🎃
          </motion.div>
        </div>
      )}

      {/* Spooky overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-deepPurple/30 via-transparent to-deepPurple/20" />
      
      {/* Corner decorations */}
      <div className="absolute top-2 left-2 text-xl opacity-50">🕸️</div>
      <div className="absolute bottom-2 right-2 text-xl opacity-50">🦇</div>
      
      {/* Mapbox attribution */}
      <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/50 rounded text-[10px] text-white/60 flex items-center gap-1">
        <span>🗺️</span>
        <span>Mapbox</span>
      </div>
    </div>
  );
};
