'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { LatLngLiteral } from '@parking/validations';
import { useLocation } from './states/useLocation';

type Props = {
  width?: string;
  height?: string;
  styles?: string;
  coordinates: LatLngLiteral;
  title?: string;
  description?: string;
  travelMode?: google.maps.TravelMode;
  onlyLocation?: boolean;
};

const DEFAULT_ZOOM = 14;

export function MapComponent({
  width = '100%',
  height = 'calc(100vh - 64px)',
  styles = '',
  coordinates,
  title = '',
  description = '',
  travelMode = google.maps.TravelMode.DRIVING,
  onlyLocation = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [distance, setDistance] = useState('');
  const [travelTime, setTravelTime] = useState('');
  const { location } = useLocation();

  const mapRef = useRef<google.maps.Map | null>(null);

  const mapContainerStyle = useMemo(
    () => ({
      width,
      height,
      borderRadius: styles,
      position: 'relative' as const,
    }),
    [width, height, styles],
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      zoomControl: true,
      tilt: 0,
      gestureHandling: 'auto',
      mapId: 'Nextjs_mapid',
    }),
    [],
  );

  const handleStart = () => {
    if (onlyLocation) return;
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported.');
      return;
    }
    if (location.lat && location.lng) {
      const next = {
        lat: location.lat,
        lng: location.lng,
      };

      setGeoError(null);
      setCurrentPosition(next);

      if (mapRef.current) {
        mapRef.current.setZoom(DEFAULT_ZOOM);
        mapRef.current.panTo(next);
      }
    } else {
      setGeoError('Unable to fetch location.');
    }
  };

  const handleStop = () => {
    setCurrentPosition(null);
    setDirections(null);
    setDistance('');
    setTravelTime('');

    if (mapRef.current) {
      mapRef.current.setZoom(DEFAULT_ZOOM);
      mapRef.current.panTo(coordinates);
    }
  };

  useEffect(() => {
    if (location.lat && location.lng) {
      setCurrentPosition({
        lat: location.lat,
        lng: location.lng,
      });
    } else {
      setCurrentPosition(null);
    }
  }, [location]);

  useEffect(() => {
    if (onlyLocation || !currentPosition) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: currentPosition,
        destination: coordinates,
        travelMode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);

          const leg = result.routes?.[0]?.legs?.[0];
          setDistance(leg?.distance?.text || '');
          setTravelTime(leg?.duration?.text || '');
        } else {
          setDirections(null);
          setDistance('');
          setTravelTime('');
        }
      },
    );
  }, [onlyLocation, currentPosition, coordinates, travelMode]);

  const userMarkerIcon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: '#1a73e8',
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: 'white',
  };

  return (
    <>
      <div className="w-full relative">
        <GoogleMap
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onUnmount={() => {
            mapRef.current = null;
          }}
          mapContainerStyle={mapContainerStyle}
          center={currentPosition || coordinates}
          zoom={DEFAULT_ZOOM}
          options={mapOptions}
        >
          {!onlyLocation && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 60,
                zIndex: 2,
              }}
            >
              {!currentPosition ? (
                <button
                  onClick={handleStart}
                  style={{
                    padding: '8px 24px',
                    borderRadius: 10,
                    background: '#13b5eb',
                    color: 'white',
                    border: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  Route
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  style={{
                    padding: '8px 24px',
                    borderRadius: 10,
                    background: '#FB923C',
                    color: 'white',
                    border: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  Stop
                </button>
              )}
            </div>
          )}

          {!onlyLocation && geoError && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                background: 'white',
                padding: '10px 14px',
                borderRadius: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: 12,
                zIndex: 2,
              }}
            >
              {geoError}
            </div>
          )}

          <MarkerF position={coordinates} />

          {title && isOpen && (
            <InfoWindowF
              position={coordinates}
              onCloseClick={() => setIsOpen(false)}
            >
              <div style={{ maxWidth: 220 }}>
                <strong>{title}</strong>
                <p style={{ margin: 0 }}>{description}</p>
              </div>
            </InfoWindowF>
          )}

          {currentPosition && (
            <MarkerF
              position={currentPosition}
              title="Your location"
              icon={userMarkerIcon}
            />
          )}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                preserveViewport: false,
              }}
            />
          )}
        </GoogleMap>
        {(distance || travelTime) && (
          <div className="absolute -bottom-11 left-1/2 -translate-x-1/2">
            <div className="inline-flex items-center gap-3 rounded-full bg-blue-50 px-5 py-2 text-sm font-medium text-blue-700 shadow-lg">
              {distance && <span>{distance}</span>}
              {distance && travelTime && <span>•</span>}
              {travelTime && <span>{travelTime}</span>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
