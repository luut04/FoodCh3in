'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/Button'; // O usá <button> normal si falla
// Si tenés iconos importados, usalos, si no borrá el Icon
// import { GoogleIcon } from '@/components/Icons'; 

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMockLogin = async () => {
    setLoading(true);
    
    // SIMULACIÓN: Hacemos de cuenta que Google nos dijo que sí
    console.log("🔓 Login simulado exitoso...");
    await new Promise(r => setTimeout(r, 1000)); // Espera dramática

    // REDIRECCIÓN MÁGICA:
    // Te mandamos directo a pagar la orden de prueba "test-123"
    // (Asegurate de haber puesto la orden falsa en ordersStore.ts como hicimos antes)
    router.push('/checkout/test-123');
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4 text-center">
      
      <h1 className="text-4xl font-extrabold text-orange-600 mb-2">
        FoodCh3in 🍔
      </h1>
      <p className="text-gray-600 mb-8 text-lg">
        La forma más rápida de pagar tu comida.<br/>
        <span className="text-sm text-gray-400">Powered by Crossmint & Arkiv</span>
      </p>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-orange-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Bienvenido</h2>
        
        <button
          onClick={handleMockLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
        >
          {/* Icono de Google trucho con texto */}
          <span className="text-xl">G</span> 
          {loading ? "Iniciando..." : "Ingresar con Google"}
        </button>

        <p className="mt-4 text-xs text-gray-400">
          * En esta demo, el login es automático.
        </p>
      </div>
    </div>
  );
}