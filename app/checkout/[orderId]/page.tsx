'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/Card'; // Asegúrate que estos componentes existan o usa divs normales
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { CreditCard, Lock } from 'lucide-react'; // Instala: npm install lucide-react
import axios from 'axios';

// Estilos simples en línea para no complicarnos con SCSS ahora mismo
// Si prefieres SCSS, mantén tus imports de estilos
const styles = {
  container: "min-h-screen bg-gray-50 py-12 px-4",
  wrapper: "max-w-md mx-auto",
  header: "mb-8 text-center",
  title: "text-3xl font-bold text-gray-900",
  subtitle: "text-gray-500 mt-2",
  inputGroup: "mb-4",
  label: "block text-xs font-bold text-gray-500 uppercase mb-1",
  input: "w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500",
  secureBadge: "flex items-center justify-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded mb-4",
};

export default function CheckoutPage() {
  // 1. HOOKS: Herramientas de Next.js para saber quién es el usuario y leer la URL
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  // 2. ESTADOS: La memoria de la pantalla
  // order: Guardamos los datos de la hamburguesa aquí
  // loading: Si está cargando los datos iniciales
  // processing: Si está procesando el pago (girando el spinner)
  const [order, setOrder] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Esperando tarjeta...");

  // 3. EFECTO INICIAL: Se ejecuta al cargar la página
  useEffect(() => {
    // Si no está logueado, lo mandamos al inicio
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    // Si está logueado, buscamos la orden
    if (status === 'authenticated' && orderId) {
      fetchOrder();
    }
  }, [status, orderId, router]);

  // 4. FUNCIÓN: Traer datos de la orden (Backend -> Frontend)
  const fetchOrder = async () => {
    try {
      // Simulamos que traemos datos. 
      // NOTA: En el futuro esto llamaría a tu base de datos real.
      // Por ahora hardcodeamos una respuesta para que NO TE FALLE.
      setOrder({
        id: orderId,
        restaurant: "Burger King Centro",
        items: [
          { name: "Doble Cheddar", price: 12.50 },
          { name: "Coca Cola", price: 3.00 }
        ],
        total: 15.50
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 5. FUNCIÓN PRINCIPAL: El Usuario hace clic en PAGAR
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que se recargue la página
    if (processing) return;

    setProcessing(true);
    
    try {
      // PASO A: Simulación visual (UX)
      setPaymentStatus("Procesando Pago Fiat (Crossmint)...");
      await new Promise(r => setTimeout(r, 2000)); // Espera falsa de 2 seg

      setPaymentStatus("Minteando NFT Inmutable (Arkiv)...");
      
      // PASO B: Llamada al Backend (Aquí ocurre la magia)
      // Enviamos los datos a TU servidor
      const response = await axios.post('/api/checkout/simulate', {
        orderId,
        userEmail: session?.user?.email || "demo@user.com",
        amount: order?.total
      });

      // PASO C: Éxito
      const { tokenId } = response.data;
      setPaymentStatus("¡Pago Exitoso!");
      await new Promise(r => setTimeout(r, 1000));

      // Redirigimos al Ticket final
      router.push(`/ticket/${tokenId}`);

    } catch (error) {
      console.error('Error pagando:', error);
      alert('Hubo un error en el pago simulado.');
      setProcessing(false);
    }
  };

  // Si está cargando la página, mostramos spinner
  if (status === 'loading' || loading) return <Loading />;

  // RENDERIZADO (Lo que se ve en pantalla)
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        {/* Cabecera */}
        <div className={styles.header}>
          <h1 className={styles.title}>Pagar Cuenta</h1>
          <p className={styles.subtitle}>Mesa #12 • {order?.restaurant}</p>
        </div>

        {/* Tarjeta de Resumen */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <h2 className="font-bold text-lg mb-4">Resumen</h2>
          {order?.items.map((item: any, i: number) => (
             <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
               <span>{item.name}</span>
               <span className="font-medium">${item.price.toFixed(2)}</span>
             </div>
          ))}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 font-bold text-xl">
            <span>Total</span>
            <span className="text-orange-600">${order?.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Formulario de Tarjeta (Simulación Crossmint) */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className={styles.secureBadge}>
            <Lock size={14} />
            <span>Pagos asegurados por Crossmint</span>
          </div>

          <form onSubmit={handlePayment}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Número de Tarjeta</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 text-gray-400" size={20}/>
                <input type="text" defaultValue="4242 4242 4242 4242" className={`${styles.input} pl-10`} />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label className={styles.label}>Fecha</label>
                <input type="text" defaultValue="12/25" className={styles.input} />
              </div>
              <div className="w-1/2">
                <label className={styles.label}>CVC</label>
                <input type="password" defaultValue="123" className={styles.input} />
              </div>
            </div>

            <Button 
              type="submit" // Importante: type submit activa el formulario
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
          
          <p className="text-center text-xs text-gray-400 mt-4">
            Al pagar, se generará automáticamente un NFT inmutable en Arkiv.
          </p>
        </div>

      </div>
    </div>
  );
}
