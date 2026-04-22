'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Server, Globe, ArrowRight, ShieldCheck, Terminal as TerminalIcon } from 'lucide-react';

export default function ProxyDemo() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [logs, setLogs] = useState<string[]>(["Sistema Proxy Ubuntu listo...", "Esperando petición del cliente..."]);
  const [response, setResponse] = useState<any>(null);

  const startDemo = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setResponse(null);
    setLogs(prev => [...prev, "> Iniciando petición HTTP vía Proxy..."]);

    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://servidor-destino.com', headers: { 'User-Agent': 'Ubuntu-Client' } })
      });
      
      const data = await res.json();
      
      // Sincronizar logs con la animación
      setTimeout(() => setLogs(prev => [...prev, ...data.proxy_logs]), 1000);
      setTimeout(() => {
        setResponse(data.data);
        setIsAnimating(false);
        setLogs(prev => [...prev, "> Ciclo completado con éxito."]);
      }, 3000);

    } catch (error) {
      setLogs(prev => [...prev, "! Error de conexión en el Proxy"]);
      setIsAnimating(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 ubuntu-gradient bg-clip-text text-transparent italic">
          Ubuntu Proxy Service Demo
        </h1>
        <p className="text-gray-400 text-xl">Arquitectura de Red y Control de Tráfico en Linux</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Nodo Cliente */}
        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 flex flex-col items-center">
          <Laptop size={64} className="text-blue-400 mb-4" />
          <h3 className="text-xl font-bold">Cliente</h3>
          <p className="text-sm text-gray-500">Navegador / App</p>
          <button 
            onClick={startDemo}
            disabled={isAnimating}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 rounded-full font-bold transition-all flex items-center gap-2"
          >
            Enviar Petición <ArrowRight size={18} />
          </button>
        </div>

        {/* Nodo Proxy Ubuntu */}
        <div className="bg-gray-900/80 p-6 rounded-2xl border-2 border-ubuntu flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-ubuntu shadow-[0_0_15px_#E95420]"></div>
          <Server size={64} className="text-ubuntu mb-4" />
          <h3 className="text-xl font-bold">Proxy Ubuntu</h3>
          <p className="text-sm text-gray-500">Squid / Nginx Proxy</p>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-800">Caché ON</span>
            <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-800">Filtro Activo</span>
          </div>
        </div>

        {/* Nodo Destino */}
        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 flex flex-col items-center">
          <Globe size={64} className="text-purple-400 mb-4" />
          <h3 className="text-xl font-bold">Internet</h3>
          <p className="text-sm text-gray-500">Servidor Destino</p>
        </div>
      </div>

      {/* Diagrama Animado */}
      <div className="relative h-24 mb-12 flex items-center justify-center">
        <div className="absolute w-[80%] h-1 bg-gray-800 rounded-full"></div>
        <AnimatePresence>
          {isAnimating && (
            <motion.div 
              initial={{ left: "10%", opacity: 0 }}
              animate={[
                { left: "50%", opacity: 1, scale: 1.5, transition: { duration: 1 } },
                { left: "90%", opacity: 1, scale: 1, transition: { duration: 1, delay: 1 } }
              ]}
              exit={{ opacity: 0 }}
              className="absolute w-6 h-6 bg-yellow-400 rounded-full shadow-[0_0_20px_#facc15] z-10 flex items-center justify-center"
            >
              <ShieldCheck size={14} className="text-black font-bold" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Terminal de Logs */}
        <div className="bg-black rounded-xl p-4 border border-gray-700 font-mono text-sm h-64 overflow-y-auto shadow-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2 text-gray-400">
            <TerminalIcon size={16} /> <span>root@ubuntu-proxy:~# tail -f /var/log/proxy/access.log</span>
          </div>
          {logs.map((log, i) => (
            <div key={i} className={log.startsWith('!') ? 'text-red-400' : log.startsWith('>') ? 'text-blue-400' : 'text-green-400'}>
              {log}
            </div>
          ))}
        </div>

        {/* Panel de Respuesta JSON */}
        <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-800 h-64 overflow-y-auto">
          <h4 className="text-gray-400 mb-4 font-bold flex items-center gap-2">
            <Globe size={16} /> Respuesta del Servidor Final
          </h4>
          {response ? (
            <pre className="text-purple-300 text-xs">{JSON.stringify(response, null, 2)}</pre>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600 italic">
              Esperando respuesta...
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-16 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        <p>© 2026 Proyecto de Redes - Implementación de Servidores Proxy en Sistemas Linux</p>
      </footer>
    </main>
  );
}