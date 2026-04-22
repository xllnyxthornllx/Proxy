'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Laptop, Server, Globe, ArrowRight, ShieldCheck, 
  Terminal as TerminalIcon, Info, Code, Settings, Activity 
} from 'lucide-react';

export default function ProxyDemo() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[SISTEMA] Proxy Ubuntu 22.04 LTS inicializado", "[INFO] Escuchando en puerto 8080 (HTTP)"]);
  const [response, setResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'demo' | 'config'>('demo');

  const startDemo = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setResponse(null);
    setLogs(prev => [...prev, "> [CLIENTE] Iniciando conexión TCP/IP...", "> [CLIENTE] GET /index.html HTTP/1.1"]);

    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://servidor-destino.com', headers: { 'User-Agent': 'Ubuntu-Demo-Client' } })
      });
      
      const data = await res.json();
      
      setTimeout(() => setLogs(prev => [...prev, "> [PROXY] Petición interceptada. Aplicando reglas de filtrado..."]), 500);
      setTimeout(() => setLogs(prev => [...prev, "> [PROXY] ACL 'local_net' permitida. Reenviando a destino..."]), 1200);
      setTimeout(() => setLogs(prev => [...prev, "> [DESTINO] 200 OK. Enviando datos de vuelta..."]), 2200);
      
      setTimeout(() => {
        setResponse(data.data);
        setIsAnimating(false);
        setLogs(prev => [...prev, "> [SISTEMA] Transmisión finalizada correctamente."]);
      }, 3000);

    } catch (error) {
      setLogs(prev => [...prev, "! [ERROR] Fallo crítico en el túnel proxy"]);
      setIsAnimating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c051a] text-white selection:bg-ubuntu selection:text-white">
      <nav className="border-b border-gray-800 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ubuntu rounded-full flex items-center justify-center font-bold">U</div>
            <span className="font-bold tracking-tight text-xl">Ubuntu <span className="text-ubuntu">Proxy</span> Demo</span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('demo')}
              className={`pb-1 transition-all ${activeTab === 'demo' ? 'border-b-2 border-ubuntu text-ubuntu' : 'text-gray-400 hover:text-white'}`}
            >
              Demostración Viva
            </button>
            <button 
              onClick={() => setActiveTab('config')}
              className={`pb-1 transition-all ${activeTab === 'config' ? 'border-b-2 border-ubuntu text-ubuntu' : 'text-gray-400 hover:text-white'}`}
            >
              Configuración Ubuntu
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 lg:p-12">
        {activeTab === 'demo' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-12">
              <span className="bg-ubuntu/10 text-ubuntu border border-ubuntu/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                Proyecto Final de Redes
              </span>
              <h2 className="text-4xl font-black mb-4">Simulación de Flujo de Datos</h2>
              <p className="text-gray-400 max-w-2xl text-lg">
                Interactúa con el sistema para visualizar cómo un servidor Ubuntu actúa como intermediario seguro entre un cliente y el internet.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16 relative">
              <div className="hidden lg:block absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-500/20 via-ubuntu/20 to-purple-500/20 -z-10"></div>

              <div className="group bg-gray-900/40 p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all text-center">
                <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Laptop size={40} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cliente Final</h3>
                <p className="text-gray-500 text-sm mb-6">IP: 192.168.1.50</p>
                <button 
                  onClick={startDemo}
                  disabled={isAnimating}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                >
                  {isAnimating ? "Procesando..." : "Realizar Petición"} <ArrowRight size={18} />
                </button>
              </div>

              <div className="bg-gray-900/80 p-8 rounded-3xl border-2 border-ubuntu relative overflow-hidden shadow-[0_0_40px_rgba(233,84,32,0.15)]">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Settings size={80} />
                </div>
                <div className="w-20 h-20 bg-ubuntu/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Server size={40} className="text-ubuntu" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-ubuntu">Proxy Ubuntu</h3>
                <p className="text-gray-500 text-sm mb-4 text-center">IP Estática: 10.0.0.1</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs border-b border-gray-800 pb-2">
                    <span className="text-gray-500 uppercase">Estado</span>
                    <span className="text-green-400 font-bold flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> ACTIVO
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 uppercase">Motor</span>
                    <span className="text-white">Squid v5.7</span>
                  </div>
                </div>
              </div>

              <div className="group bg-gray-900/40 p-8 rounded-3xl border border-gray-800 hover:border-purple-500/50 transition-all text-center">
                <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Globe size={40} className="text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Servidor Destino</h3>
                <p className="text-gray-500 text-sm mb-6">api.externa.com</p>
                <div className="text-xs text-purple-400 bg-purple-900/20 py-2 rounded-lg border border-purple-800/30">
                  HTTPS Puerto 443
                </div>
              </div>
            </div>

            <div className="relative h-24 mb-16 flex items-center justify-center">
              <AnimatePresence>
                {isAnimating && (
                  <motion.div 
                    initial={{ left: "15%", opacity: 0 }}
                    animate={{ 
                      left: ["15%", "50%", "85%"],
                      opacity: [0, 1, 1],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2,
                      times: [0, 0.5, 1],
                      ease: "easeInOut"
                    }}
                    exit={{ opacity: 0 }}
                    className="absolute w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.5)] z-10 flex items-center justify-center border-2 border-white/20"
                  >
                    <Activity size={20} className="text-black" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs tracking-widest ml-1">
                  <TerminalIcon size={16} className="text-ubuntu" /> Logs de Ubuntu Server
                </h4>
                <div className="bg-black/80 rounded-2xl p-6 border border-gray-800 font-mono text-sm h-80 overflow-y-auto shadow-2xl custom-scrollbar">
                  {logs.map((log, i) => (
                    <div key={i} className={`mb-1 ${log.startsWith('!') ? 'text-red-400' : log.startsWith('>') ? 'text-blue-300' : 'text-green-500/80'}`}>
                      <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs tracking-widest ml-1">
                  <ShieldCheck size={16} className="text-purple-400" /> Carga Útil (Payload)
                </h4>
                <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-800 h-80 overflow-y-auto shadow-inner">
                  {response ? (
                    <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-purple-300 text-sm leading-relaxed">
                      {JSON.stringify(response, null, 2)}
                    </motion.pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 italic">
                      <div className="w-12 h-12 rounded-full border-2 border-gray-800 border-t-gray-600 animate-spin mb-4"></div>
                      Esperando respuesta del servidor remoto...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Guía Técnica de Implementación</h2>
              <p className="text-gray-400">Cómo configurar este servicio en un entorno Ubuntu real.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800">
                <h3 className="flex items-center gap-2 font-bold mb-4 text-ubuntu">
                  <Code size={20} /> Instalación de Squid
                </h3>
                <pre className="bg-black p-4 rounded-xl text-xs text-green-400 border border-gray-800">
                  sudo apt update{"\n"}
                  sudo apt install squid -y{"\n"}
                  sudo systemctl start squid{"\n"}
                  sudo systemctl enable squid
                </pre>
              </div>

              <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800">
                <h3 className="flex items-center gap-2 font-bold mb-4 text-blue-400">
                  <Settings size={20} /> Configuración ACL
                </h3>
                <pre className="bg-black p-4 rounded-xl text-xs text-gray-300 border border-gray-800">
                  # /etc/squid/squid.conf{"\n"}
                  acl localnet src 192.168.1.0/24{"\n"}
                  http_access allow localnet{"\n"}
                  http_port 3128
                </pre>
              </div>
            </div>

            <div className="bg-ubuntu/5 border border-ubuntu/20 p-8 rounded-3xl">
              <div className="flex gap-4">
                <Info className="text-ubuntu shrink-0" size={24} />
                <div>
                  <h4 className="font-bold mb-2 text-lg">Nota para el Proyecto Final</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Un servidor proxy no solo redirige tráfico; es fundamental para la seguridad perimetral, 
                    el almacenamiento en caché (ahorro de ancho de banda) y el filtrado de contenido en redes corporativas. 
                    En Ubuntu, **Squid** es el estándar de la industria, mientras que **Nginx** destaca como Proxy Inverso.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="mt-20 border-t border-gray-800 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm">
            © 2026 - Proyecto de Demostración de Servicios de Red
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-gray-900 rounded-lg text-xs font-mono text-gray-400 border border-gray-800">
              Desplegado en: <span className="text-white">Netlify Edge</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #E95420;
        }
      `}</style>
    </div>
  );
}