'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { Ticket, Wallet, ArrowRight } from 'lucide-react'; // Asegurate de tener los iconos
import axios from 'axios';

export default function WalletPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await axios.get('/api/wallet');
      setTickets(res.data.tickets);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-md mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="text-orange-500" />
            Mis Tickets
          </h1>
          <div className="text-xs bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            {tickets.length} NFTs
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No tenés tickets todavía.</p>
            <Button className="mt-4" onClick={() => router.push('/')}>
              Ir a Comprar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div 
                key={ticket.tokenId}
                onClick={() => router.push(`/ticket/${ticket.tokenId}`)}
                className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex justify-between items-center hover:bg-gray-750 cursor-pointer transition-all active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${ticket.consumed ? 'bg-gray-700 text-gray-500' : 'bg-orange-500/20 text-orange-500'}`}>
                    {ticket.consumed ? '💀' : '🍔'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{ticket.itemName}</h3>
                    <p className="text-xs text-gray-400">ID: {ticket.tokenId}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold
                    ${ticket.consumed ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
                    {ticket.consumed ? 'USADO' : 'ACTIVO'}
                  </span>
                  <ArrowRight size={16} className="ml-auto mt-2 text-gray-600" />
                </div>
              </div>
            ))}
          </div>
        )}

        <Button 
          className="w-full mt-8 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
          onClick={() => router.push('/')}
        >
          Volver al Inicio
        </Button>

      </div>
    </div>
  );
}