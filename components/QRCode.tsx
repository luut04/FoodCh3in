'use client';

import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';
import styles from '@/styles/QRCode.module.scss';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 256, className = '' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 2,
          color: {
            dark: '#a855f7',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR Code generation error:', error);
        }
      );
    }
  }, [value, size]);

  return (
    <div className={`${styles.qrContainer} ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}
