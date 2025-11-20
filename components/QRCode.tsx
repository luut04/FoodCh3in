import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

export const QRCode = ({ value, size = 200 }: QRCodeProps) => {
  // Usamos una API pública segura para generar la imagen del QR
  // Esto evita tener que hacer npm install qrcode.react
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

  return (
    <div className="bg-white p-2 rounded-lg inline-block">
      <img 
        src={qrUrl} 
        alt="QR Code" 
        width={size} 
        height={size}
        className="rounded-md"
      />
    </div>
  );
};