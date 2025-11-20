'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { CreditCard, Lock } from 'lucide-react';
import axios from 'axios';

// Estilos en línea para evitar errores de CSS
const styles = {
  container: "min-h-screen bg-gray-50 py-12 px-4",
  wrapper: "max-w-md mx-auto",
  header: "mb-8 text-center",
  title: "text-3xl font-bold text-gray-900",
  subtitle: "text-gray-500 mt-2",
  inputGroup: "mb-4",
  label: "block text-xs font-bold text-gray-500 uppercase mb-1",
  input: "w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black",
  secureBadge: "flex items-center justify-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded mb-4",
};

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  // Manejo seguro del ID
  const orderId = typeof params?.orderId === 'string' ? params.orderId : 'test-123';

  const [order, setOrder] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Pagar Ahora");

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      // Le avisamos al backend que existimos
      await axios.post('/api/checkout/simulate', { orderId });
      
      setOrder({
        id: orderId,
        restaurant: "Burger King - Demo",
        items: [{ name: "Hamburguesa Hackaton", price: 12.50 }],
        total: 12.50
      });

    } catch (error) {
      console.log("⚠️ Usando datos de respaldo...");
      setOrder({
        id: orderId,
        restaurant: "Burger King (Modo Demo)",
        items: [
          { name: "Super Demo Burger", price: 12.50 },
          { name: "Papas Fritas", price: 3.50 }
        ],
        total: 16.00
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (processing) return;
    setProcessing(true);
    
    try {
      setPaymentStatus("Procesando Tarjeta...");
      await new Promise(r => setTimeout(r, 1500)); 

      setPaymentStatus("Minteando NFT en Arkiv...");
      
      // Llamamos a "EL CEREBRO" (tu otro archivo)
      const response = await axios.post('/api/checkout/simulate', {
        orderId,
        amount: order?.total
      });

      const { tokenId } = response.data;
      setPaymentStatus("¡Éxito!");
      await new Promise(r => setTimeout(r, 800));

      router.push(`/ticket/${tokenId}`);

    } catch (error) {
      console.error('Error:', error);
      alert('Error simulado. Intentá de nuevo.');
      setProcessing(false);
      setPaymentStatus("Reintentar");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        <div className={styles.header}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.subtitle}>Orden #{orderId.slice(0,6)} • {order?.restaurant}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <h2 className="font-bold text-lg mb-4 text-black">Tu Pedido</h2>
          {order?.items?.map((item: any, i: number) => (
             <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-gray-800">
               <span>{item.name}</span>
               <span className="font-medium">${item.price.toFixed(2)}</span>
             </div>
          ))}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 font-bold text-xl text-black">
            <span>Total a Pagar</span>
            <span className="text-orange-600">${order?.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className={styles.secureBadge}>
            <Lock size={14} />
            <span>Checkout Seguro por Crossmint</span>
          </div>

          <form onSubmit={handlePayment}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tarjeta</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 text-gray-400" size={20}/>
                <input type="text" defaultValue="4242 4242 4242 4242" className={`${styles.input} pl-10`} />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label className={styles.label}>Expira</label>
                <input type="text" defaultValue="12/28" className={styles.input} />
              </div>
              <div className="w-1/2">
                <label className={styles.label}>CVC</label>
                <input type="password" defaultValue="123" className={styles.input} />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={processing}
              className="w-full py-4 text-lg font-bold bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  {paymentStatus}
                </span>
              ) : (
                `Pagar $${order?.total.toFixed(2)}`
              )}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}