'use client';

'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

type QRGeneratorProps = {
  text?: string;
  size?: number;
};

const QRGenerator: React.FC<QRGeneratorProps> = ({ text, size = 240 }) => {
  const [inputValue, setInputValue] = useState<string>(text ?? '');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, inputValue || ' ', {
      width: size,
      margin: 2,
    }).catch(() => {});
  }, [inputValue, size]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <aside className="inset-y-0 bg-white border-r border-gray-200 p-6 overflow-y-auto shadow-sm">
      <h2 className="text-lg font-semibold mb-4">QR Generator</h2>

      <label className="text-sm text-gray-600">Text / URL</label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder=""
        className="mt-2 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="mt-6 flex items-center gap-4">
        <div
          className="rounded-md border overflow-hidden flex justify-center items-center bg-white"
          style={{ width: size, height: size }}
        >
          <canvas ref={canvasRef} width={size} height={size} />
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleDownload}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
          >
            Download PNG
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(inputValue)}
            className="px-3 py-2 border rounded-md hover:bg-gray-50"
          >
            Copy Text
          </button>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        QR size is fixed at <strong>{size}px</strong>. You can provide an
        initial text via the <code>text</code> prop.
      </p>
    </aside>
  );
};

export { QRGenerator };
