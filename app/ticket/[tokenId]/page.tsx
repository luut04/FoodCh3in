'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { QRCode } from '@/components/QRCode'; 
import { Loading } from '@/components/Loading';
import axios from 'axios';

const styles = {
  container: "min-h-screen bg-gray-900 text-white py-12 px-4",
  successHeader: "text-center mb-8",
  card: "max-w-md mx-auto bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl",
  cardBody: "p-6",
  label: "text-xs text-gray-400 uppercase font-bold mb-1",
  value: "text-lg text-white font-mono mb-4 break-all",
  badge: "inline-block bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded mb-4",
  qrContainer: "bg-white p-4 rounded-xl mb-6 flex justify-center",
  btn: "w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all mt-4"
};

export default function TicketPage() {
  const router = useRouter();
  const params = useParams();
  const tokenId = params.tokenId as string;

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tokenId) {
      fetchTicket();
    }
  }, [tokenId]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`/api/tickets/${tokenId}`);
      setTicket(response.data);
    } catch (error) {
      console.log("⚠️ Ticket no encontrado. Usando Demo...");
      setTicket({
        tokenId: tokenId,
        owner: "0x71C...9A2",
        consumed: false,
        metadataUrl: `arkiv://orders/${tokenId}/proof`,
        order: {
          id: "demo-order-1",
          total: 12.50,
          items: [{ name: "Hamburguesa Hackaton", price: 12.50 }]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const validatorLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/validator?tokenId=${tokenId}` 
    : '';

  return (
    <div className={styles.container}>
      <div className={styles.successHeader}>
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-400">¡Pago Exitoso!</h1>
        <p className="text-gray-400">Tu NFT ha sido minteado en Arkiv.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold mb-4">Ticket Digital</h2>
            <span className={styles.badge}>✅ ACTIVO</span>
          </div>

          <div className={styles.qrContainer}>
             <QRCode value={validatorLink} size={200} />
          </div>
          
          <p className="text-center text-xs text-gray-500 mb-6">
            Mostrá este QR para retirar.
          </p>

          <div>
            <p className={styles.label}>Token ID</p>
            <p className={styles.value}>{tokenId}</p>

            <p className={styles.label}>Item</p>
            <p className={styles.value}>
              {ticket?.order?.items?.[0]?.name || "Hamburguesa"}
            </p>
          </div>

          <Button className={styles.btn} onClick={() => router.push('/')}>
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}