'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, CameraDevice } from 'html5-qrcode';

type CameraOption = {
  id: string;
  label: string;
};

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState('—');
  const [cameras, setCameras] = useState<CameraOption[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<
    string | undefined
  >();
  const [loadingCameras, setLoadingCameras] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const html5QrRef = useRef<Html5Qrcode | null>(null);
  const readerId = useRef('html5qr-reader');

  const refreshCameras = async () => {
    setLoadingCameras(true);
    setError(null);
    try {
      const devices: CameraDevice[] = await Html5Qrcode.getCameras();
      const options = devices.map((d) => ({
        id: d.id,
        label: d.label || `Camera ${d.id.slice(0, 6)}`,
      }));
      setCameras(options);
      const backCam = options.find((c) =>
        /back|rear|environment/i.test(c.label),
      );
      setSelectedCameraId(backCam ? backCam.id : options[0]?.id);
    } catch {
      setError(
        'Unable to access camera devices. Check permissions or try another browser.',
      );
      setCameras([]);
      setSelectedCameraId(undefined);
    } finally {
      setLoadingCameras(false);
    }
  };

  useEffect(() => {
    refreshCameras();
    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
        html5QrRef.current.clear();
        html5QrRef.current = null;
      }
    };
  }, []);

  const startScanner = async () => {
    if (scanning) return;
    if (!selectedCameraId) {
      setError('No camera selected.');
      return;
    }
    setError(null);
    setLastResult('—');
    setScanning(true);
    const html5Qr = new Html5Qrcode(readerId.current);
    html5QrRef.current = html5Qr;
    const config = { fps: 10, qrbox: { width: 300, height: 300 } };
    try {
      await html5Qr.start(
        selectedCameraId,
        config,
        (decodedText: string) => {
          setLastResult(decodedText);
        },
        () => {},
      );
    } catch {
      setError(
        'Failed to start the camera. Make sure permissions are granted.',
      );
      setScanning(false);
      if (html5QrRef.current) {
        try {
          await html5QrRef.current.stop();
        } catch {}
        html5QrRef.current.clear();
        html5QrRef.current = null;
      }
    }
  };

  const stopScanner = async () => {
    if (!scanning) return;
    setScanning(false);
    const html5Qr = html5QrRef.current;
    if (!html5Qr) return;
    try {
      await html5Qr.stop();
    } catch {}
    try {
      html5Qr.clear();
    } catch {}
    html5QrRef.current = null;
  };

  useEffect(() => {
    if (!scanning) return;
    const restart = async () => {
      try {
        await stopScanner();
        await startScanner();
      } catch {
        setError(
          'Error switching camera. Try stopping and restarting manually.',
        );
      }
    };
    restart();
  }, [selectedCameraId]);

  return (
    <main className="ml-80 min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold">QR Scanner</h1>
            <p className="text-sm text-gray-500">
              Select a camera and start scanning
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="px-3 py-2 border rounded-md text-sm bg-white"
              value={selectedCameraId ?? ''}
              onChange={(e) => setSelectedCameraId(e.target.value)}
              disabled={loadingCameras || cameras.length === 0}
            >
              {loadingCameras && <option>Loading cameras...</option>}
              {!loadingCameras && cameras.length === 0 && (
                <option>No cameras found</option>
              )}
              {cameras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <button
              onClick={refreshCameras}
              type="button"
              className="px-3 py-2 border rounded-md text-sm hover:bg-gray-100"
            >
              Refresh
            </button>
            <button
              onClick={startScanner}
              disabled={scanning}
              className="px-3 py-2 bg-green-600 text-white rounded-md disabled:opacity-60"
            >
              Start
            </button>
            <button
              onClick={stopScanner}
              disabled={!scanning}
              className="px-3 py-2 bg-red-600 text-white rounded-md disabled:opacity-60"
            >
              Stop
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="mt-6">
          <div
            id={readerId.current}
            className="w-full h-[420px] bg-white rounded-md shadow-sm flex items-center justify-center overflow-hidden"
          >
            <div className="text-sm text-gray-400">
              Camera preview will appear here
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-md shadow-sm">
            <div className="text-sm text-gray-500">Last result:</div>
            <div className="mt-2 text-sm font-medium text-gray-800 break-words">
              {lastResult}
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Allow camera access — test on mobile or with a webcam.
          </p>
        </div>
      </div>
    </main>
  );
};

export { QRScanner };
