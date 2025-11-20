"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wallet, ArrowLeft, Home, Scan, CreditCard, QrCode, CheckCircle2, Gift, Coffee, Pizza } from "lucide-react"

// 1. AGREGAMOS 'redeem' A LOS TIPOS
type View = "login" | "home" | "scan_simulation" | "select_card" | "payment_confirmation" | "receipt_nft" | "nft_gallery" | "redeem"

export default function FoodCh3inApp() {
  const [currentView, setCurrentView] = useState<View>("login")
  const [isScanning, setIsScanning] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"confirm" | "processing" | "minting" | "complete">("confirm")
  const [loadingLogin, setLoadingLogin] = useState(false)
  
  // Datos Mock
  const userWallet = { name: "Martin", avatar: "https://ui-avatars.com/api/?name=Martin&background=0ea5e9&color=fff" }
  const balance = { fiat: 250.0, crypto: 0.0125, points: 120 } // Agregamos Puntos
  const [selectedCard, setSelectedCard] = useState({ id: "1", name: "Crossmint Wallet", lastFour: "4242", color: "from-cyan-500 to-blue-600" })

  const merchantOrder = {
    merchant: "Burger King - Centro",
    table: 4,
    items: ["1x Combo Whopper", "1x Papas Grandes"],
    amount: 12.50,
  }

  // --- FUNCIONES ---
  const handleLogin = async () => {
    setLoadingLogin(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoadingLogin(false)
    setCurrentView("home")
  }

  const handleScan = async () => {
    setIsScanning(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsScanning(false)
    setCurrentView("select_card")
  }

  const handlePayment = async () => {
    setPaymentStep("processing")
    await new Promise((resolve) => setTimeout(resolve, 1500)) 
    setPaymentStep("minting")
    await new Promise((resolve) => setTimeout(resolve, 2000)) 
    setPaymentStep("complete")
    setCurrentView("receipt_nft")
  }

  // --- COMPONENTE DE BARRA DE NAVEGACIÓN (FOOTER) ---
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50">
      <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-around">
        <button 
          onClick={() => setCurrentView("home")}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'home' ? 'text-cyan-500' : 'text-gray-400 hover:text-white'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-semibold">Inicio</span>
        </button>
        
        <div className="relative -top-6">
            <button 
              onClick={() => setCurrentView("scan_simulation")}
              className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-4 shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
            >
                <Scan className="w-6 h-6" />
            </button>
        </div>

        <button 
          onClick={() => setCurrentView("nft_gallery")}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'nft_gallery' ? 'text-cyan-500' : 'text-gray-400 hover:text-white'}`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-xs font-semibold">NFTs</span>
        </button>
      </div>
    </div>
  )

  // --- VISTAS ---

  const LoginView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-4 rounded-2xl shadow-lg shadow-cyan-500/20">
                <Wallet className="w-10 h-10 text-white" />
            </div>
        </div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">FoodCh3in</h1>
        <p className="text-slate-400">Pagos invisibles. Recompensas reales.</p>
      </div>
      
      <Card className="w-full max-w-sm bg-slate-900 border-slate-800 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-center">Bienvenido</CardTitle>
          <CardDescription className="text-center text-slate-400">Inicia sesión para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleLogin} 
            className="w-full h-12 text-base font-bold bg-white text-black hover:bg-gray-200 transition-all"
            disabled={loadingLogin}
          >
            {loadingLogin ? "Conectando..." : "Ingresar con Google"}
          </Button>
          <p className="text-xs text-center text-slate-600 mt-6">
            Powered by <span className="text-cyan-500 font-medium">Crossmint</span> & <span className="text-blue-500 font-medium">Arkiv</span>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )

  const HomeView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500 bg-slate-800 overflow-hidden">
             <img src={userWallet.avatar} alt="User" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Hola,</p>
            <p className="text-xl font-bold">{userWallet.name}</p>
          </div>
        </div>
      </div>

      {/* Tarjeta de Saldo */}
      <div className="px-6 mb-6">
        <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 border-0 shadow-xl shadow-cyan-900/20 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-cyan-100 text-sm mb-1 font-medium">Saldo Disponible</p>
                    <p className="text-4xl font-bold mb-4">${balance.fiat.toFixed(2)}</p>
                </div>
                <div className="text-right">
                    <p className="text-cyan-100 text-sm mb-1 font-medium">Puntos Arkiv</p>
                    <p className="text-2xl font-bold text-yellow-300">{balance.points} Pts</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs bg-black/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]"></div>
              Powered by Crossmint
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6">
        <h3 className="text-lg font-bold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 gap-4">
            <div onClick={() => setCurrentView('nft_gallery')} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 cursor-pointer hover:border-cyan-500/50 transition-all">
                <Wallet className="text-cyan-500 mb-2" />
                <p className="font-bold">Mis NFTs</p>
                <p className="text-xs text-slate-400">Ver tickets</p>
            </div>
            <div onClick={() => setCurrentView('redeem')} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 cursor-pointer hover:border-yellow-500/50 transition-all">
                <Gift className="text-yellow-500 mb-2" />
                <p className="font-bold">Canjear</p>
                <p className="text-xs text-slate-400">Usar puntos</p>
            </div>
        </div>
      </div>

      <BottomNav />
    </motion.div>
  )

  const ScanView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center">
       <div className="w-72 h-72 border-2 border-cyan-500 relative flex items-center justify-center overflow-hidden rounded-3xl bg-slate-900/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-cyan-500/5 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] animate-[scan_2s_infinite]"></div>
          <div className="text-center">
            <QrCode className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-50" />
            <p className="text-xs text-cyan-400 font-mono tracking-widest">BUSCANDO CÓDIGO...</p>
          </div>
       </div>
       <div className="absolute bottom-24 w-full px-6 space-y-3">
         <Button onClick={handleScan} disabled={isScanning} className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-gray-200 rounded-xl">
            {isScanning ? "Escaneando..." : "Simular QR Mesa #4"}
         </Button>
         <Button variant="ghost" className="w-full text-slate-400 hover:text-white" onClick={() => setCurrentView("home")}>Cancelar</Button>
       </div>
    </motion.div>
  )

  const PaymentView = () => (
    <motion.div initial={{ x: 100 }} animate={{ x: 0 }} className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8 pt-4">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView("home")} className="text-slate-400 hover:text-white hover:bg-slate-800"><ArrowLeft /></Button>
        <h1 className="text-xl font-bold">Confirmar Pago</h1>
      </div>

      <Card className="bg-slate-900 border-slate-800 mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-lg">{merchantOrder.merchant}</CardTitle>
          <CardDescription className="text-slate-400">Mesa #{merchantOrder.table}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {merchantOrder.items.map((item, i) => (
            <div key={i} className="flex justify-between text-slate-300 text-sm">
              <span>{item}</span>
              <span>--</span>
            </div>
          ))}
          <div className="h-px bg-slate-800 my-2"></div>
          <div className="flex justify-between text-xl font-bold text-white">
            <span>Total</span>
            <span className="text-cyan-400">${merchantOrder.amount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 mb-8 shadow-lg">
        <div className={`w-12 h-8 rounded bg-gradient-to-r ${selectedCard.color}`}></div>
        <div>
          <p className="font-bold text-sm">{selectedCard.name}</p>
          <p className="text-xs text-slate-400">•••• {selectedCard.lastFour}</p>
        </div>
        <Button variant="ghost" className="ml-auto text-cyan-400 text-xs hover:text-cyan-300 hover:bg-transparent" size="sm">Cambiar</Button>
      </div>

      {paymentStep === 'confirm' ? (
        <Button onClick={handlePayment} className="w-full h-16 text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-lg shadow-blue-900/20">
          Pagar Ahora
        </Button>
      ) : (
        <div className="text-center space-y-6 py-8 bg-slate-900/50 rounded-2xl border border-slate-800">
           <div className="relative mx-auto w-16 h-16">
             <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
           <div>
             <p className="text-lg font-bold text-white animate-pulse">
                {paymentStep === 'processing' ? "Procesando Tarjeta..." : "Minteando en Arkiv..."}
             </p>
             <p className="text-slate-500 text-sm mt-1">No cierres la aplicación</p>
           </div>
        </div>
      )}
    </motion.div>
  )

  const ReceiptView = () => (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(74,222,128,0.1)]">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">¡Pago Exitoso!</h1>
        <p className="text-slate-400">Tu NFT ha sido generado.</p>
      </div>
      <div className="w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
            <div>
                <p className="text-cyan-400 text-xs font-bold tracking-widest mb-1">TICKET NFT</p>
                <p className="text-white font-bold text-xl">Burger King #8821</p>
            </div>
            <div className="bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide">ARKIV</div>
            </div>
            <div className="bg-white p-4 rounded-xl mb-8 mx-auto w-fit shadow-lg">
                <QrCode className="w-40 h-40 text-black" />
            </div>
            <div className="space-y-3 text-sm border-t border-white/10 pt-4">
            <div className="flex justify-between">
                <span className="text-slate-400">Puntos Ganados</span>
                <span className="text-green-400 font-bold bg-green-900/20 px-2 py-0.5 rounded border border-green-500/20">+50 Pts</span>
            </div>
            </div>
        </div>
      </div>
      <Button onClick={() => setCurrentView("home")} className="mt-10 w-full max-w-sm h-14 text-lg font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl">
        Volver al Inicio
      </Button>
    </motion.div>
  )

  // --- NUEVA VISTA DE GALERÍA NFT ---
  const NFTGalleryView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-950 text-white pb-24">
        <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setCurrentView("home")} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">Mis Tickets NFT</h1>
            </div>
        </div>

        <div className="px-6 py-6 space-y-6">
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div>
                    <p className="text-yellow-500 font-bold">Puntos Arkiv</p>
                    <p className="text-2xl font-bold text-white">{balance.points} Pts</p>
                </div>
                <Button onClick={() => setCurrentView('redeem')} size="sm" className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold">
                    Canjear
                </Button>
            </div>

            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 items-center">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400">
                            <QrCode className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold">Burger King Ticket #{8820 + i}</p>
                            <p className="text-xs text-slate-400">Arkiv Verified • {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <BottomNav />
    </motion.div>
  )

  // --- NUEVA VISTA DE CANJE (REDEEM) ---
  const RedeemView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-950 text-white pb-24">
        <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setCurrentView("home")} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">Tienda de Puntos</h1>
            </div>
        </div>

        <div className="px-6 py-6">
            <div className="mb-6 text-center">
                <p className="text-slate-400 mb-1">Tus Puntos</p>
                <h2 className="text-5xl font-bold text-yellow-400">{balance.points}</h2>
            </div>

            <div className="grid gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                                <Coffee className="text-orange-500 w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-white">Café Gratis</p>
                                <p className="text-xs text-slate-400">Starbucks</p>
                            </div>
                        </div>
                        <Button size="sm" className="bg-slate-800 text-white border border-slate-700 hover:bg-slate-700">
                            50 Pts
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                                <Pizza className="text-red-500 w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-white">Porción Pizza</p>
                                <p className="text-xs text-slate-400">Pizza Hut</p>
                            </div>
                        </div>
                        <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold">
                            100 Pts
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
        <BottomNav />
    </motion.div>
  )

  // RENDERIZADO PRINCIPAL
  return (
    <AnimatePresence mode="wait">
      {currentView === "login" && <LoginView />}
      {currentView === "home" && <HomeView />}
      {currentView === "scan_simulation" && <ScanView />}
      {currentView === "select_card" && <HomeView />} 
      {currentView === "select_card" && setTimeout(() => setCurrentView("payment_confirmation"), 10) && null}
      {currentView === "payment_confirmation" && <PaymentView />}
      {currentView === "receipt_nft" && <ReceiptView />}
      {currentView === "nft_gallery" && <NFTGalleryView />}
      {currentView === "redeem" && <RedeemView />}
    </AnimatePresence>
  )
}