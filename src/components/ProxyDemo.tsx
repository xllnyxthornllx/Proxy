'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Laptop, Server, Globe, ArrowRight, ShieldCheck, 
  Terminal as TerminalIcon, Info, Code, Settings, Activity,
  Lock, Unlock, ShieldAlert, Clock, Users, Globe2
} from 'lucide-react';

type ACLRule = {
  id: string;
  name: string;
  description: string;
  code: string;
  status: 'allow' | 'deny';
  icon: any;
};

const ACL_RULES: ACLRule[] = [
  {
    id: 'local_net',
    name: 'Red Local (LAN)',
    description: 'Permitir acceso total a dispositivos en 192.168.1.0/24',
    status: 'allow',
    icon: Users,
    code: 'acl localnet src 192.168.1.0/24\nhttp_access allow localnet'
  },
  {
    id: 'social_block',
    name: 'Bloqueo Social Media',
    description: 'Denegar dominios de redes sociales durante jornada laboral',
    status: 'deny',
    icon: ShieldAlert,
    code: 'acl social_domains dstdomain .facebook.com .instagram.com\nhttp_access deny social_domains'
  },
  {
    id: 'guest_limited',
    name: 'Red Invitados',
    description: 'Acceso restringido a puertos estándar (80, 443)',
    status: 'allow',
    icon: Globe2,
    code: 'acl guest_net src 10.0.0.0/24\nacl safe_ports port 80 443\nhttp_access allow guest_net safe_ports'
  },
  {
    id: 'time_restriction',
    name: 'Restricción Horaria',
    description: 'Bloquear acceso a internet después de las 22:00',
    status: 'deny',
    icon: Clock,
    code: 'acl night_shift time MTWHF 22:00-06:00\nhttp_access deny night_shift'
  }
];

export default function ProxyDemo() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedACL, setSelectedACL] = useState<ACLRule>(ACL_RULES[0]);
  const [logs, setLogs] = useState<string[]>(["[SISTEMA] Proxy Ubuntu 22.04 LTS inicializado", "[INFO] Cargando reglas ACL desde /etc/squid/squid.conf"]);
  const [response, setResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'demo' | 'config'>('demo');
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'blocked'>('idle');

  const runTest = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTestStatus('idle');
    setResponse(null);
    setLogs(prev => [...prev, `> [SOLICITUD] Cliente intenta acceder vía ACL: ${selectedACL.name}`]);

    // Simulación de delay de red
    setTimeout(async () => {
      if (selectedACL.status === 'deny') {
        setLogs(prev => [...prev, `! [BLOQUEO] Regla detectada: ${selectedACL.id}`, `! [TCP_DENIED] 403 Forbidden - Acceso denegado por políticas de seguridad`]);
        setTestStatus('blocked');
        setIsAnimating(false);
      } else {
        setLogs(prev => [...prev, `> [PROXY] Validando origen y destino... OK`, `> [PROXY] Reenviando paquete a servidor remoto...`]);
        
        try {
          const res = await fetch('/api/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ acl: selectedACL.id, url: 'https://api.destino.com' })
          });
          const data = await res.json();
          
          setTimeout(() => {
            setResponse(data.data);
            setTestStatus('success');
            setIsAnimating(false);
            setLogs(prev => [...prev, `> [SISTEMA] 200 OK - Petición completada con éxito`]);
          }, 1500);
        } catch (e) {
          setLogs(prev => [...prev, "! [ERROR] Fallo de conexión"]);
          setIsAnimating(false);
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0c020b] text-white selection:bg-ubuntu selection:text-white font-sans">
      {/* Navbar Superior Estilo Dashboard */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ubuntu rounded-xl flex items-center justify-center font-bold shadow-lg shadow-ubuntu/20">U</div>
            <div>
              <span className="font-bold tracking-tight text-lg block leading-none text-white">Ubuntu Server <span className="text-ubuntu">Proxy</span></span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Network Security Lab</span>
            </div>
          </div>
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
            <button 
              onClick={() => setActiveTab('demo')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'demo' ? 'bg-ubuntu text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Laboratorio en Vivo
            </button>
            <button 
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-ubuntu text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Documentación Técnica
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-6 flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Reglas ACL */}
        <aside className="w-full lg:w-80 space-y-4">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">Configuración de ACLs</h3>
          {ACL_RULES.map((rule) => (
            <button
              key={rule.id}
              onClick={() => setSelectedACL(rule)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                selectedACL.id === rule.id 
                ? 'bg-ubuntu/10 border-ubuntu shadow-[0_0_20px_rgba(233,84,32,0.1)]' 
                : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${selectedACL.id === rule.id ? 'bg-ubuntu text-white' : 'bg-white/10 text-gray-400'}`}>
                  <rule.icon size={18} />
                </div>
                <span className={`font-bold text-sm ${selectedACL.id === rule.id ? 'text-white' : 'text-gray-400'}`}>{rule.name}</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{rule.description}</p>
              <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                <code className="text-[9px] text-ubuntu/80 font-mono block whitespace-pre">
                  {rule.code.split('\n')[0]}
                </code>
              </div>
            </button>
          ))}
        </aside>

        {/* Área Central de Demostración */}
        <section className="flex-1 space-y-8">
          {activeTab === 'demo' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Arquitectura Visual */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(233,84,32,0.05),transparent)] pointer-events-none"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center relative z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-4 border border-blue-500/20 shadow-2xl">
                      <Laptop size={44} className="text-blue-500" />
                    </div>
                    <span className="font-bold text-sm">Cliente</span>
                    <span className="text-[10px] text-gray-500 font-mono">192.168.1.50</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mb-4 border-2 transition-all duration-500 shadow-2xl ${
                      testStatus === 'blocked' ? 'bg-red-500/10 border-red-500' : 
                      testStatus === 'success' ? 'bg-green-500/10 border-green-500' :
                      'bg-ubuntu/10 border-ubuntu'
                    }`}>
                      <Server size={56} className={testStatus === 'blocked' ? 'text-red-500' : testStatus === 'success' ? 'text-green-500' : 'text-ubuntu'} />
                    </div>
                    <span className="font-bold text-sm">Proxy Ubuntu</span>
                    <div className="flex gap-2 mt-2">
                       {selectedACL.status === 'allow' ? <Unlock size={12} className="text-green-500" /> : <Lock size={12} className="text-red-500" />}
                       <span className="text-[10px] uppercase font-black tracking-tighter">ACL: {selectedACL.id}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-gray-500">
                    <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-4 border border-white/10">
                      <Globe size={44} />
                    </div>
                    <span className="font-bold text-sm">Internet</span>
                  </div>
                </div>

                {/* Línea de Animación */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-[22px]"></div>
                <AnimatePresence>
                  {isAnimating && (
                    <motion.div 
                      initial={{ left: "20%", opacity: 0 }}
                      animate={
                        selectedACL.status === 'deny' 
                        ? { left: ["20%", "47%", "20%"], opacity: [0, 1, 0], scale: [1, 1.5, 1] }
                        : { left: ["20%", "50%", "80%"], opacity: [0, 1, 0], scale: [1, 1.5, 1] }
                      }
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className={`absolute top-1/2 -translate-y-[34px] w-6 h-6 rounded-lg flex items-center justify-center shadow-2xl z-20 ${
                        selectedACL.status === 'deny' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    >
                      <Activity size={14} className="text-black" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controles y Consola */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-gray-900/40 rounded-3xl p-8 border border-white/5">
                  <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
                    <Settings size={18} className="text-ubuntu" /> Ejecutar Prueba de Acceso
                  </h4>
                  <p className="text-gray-400 text-sm mb-8">
                    Prueba la configuración seleccionando una regla en el panel izquierdo y observa cómo el Proxy Ubuntu procesa el tráfico en tiempo real.
                  </p>
                  <button 
                    onClick={runTest}
                    disabled={isAnimating}
                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl ${
                      isAnimating ? 'bg-gray-800 text-gray-500' : 'bg-ubuntu hover:bg-ubuntu/80 text-white shadow-ubuntu/20'
                    }`}
                  >
                    {isAnimating ? "Analizando Paquete..." : "Lanzar Petición HTTP"}
                    <ArrowRight size={22} />
                  </button>
                </div>

                <div className="bg-black/60 rounded-3xl p-6 border border-white/5 font-mono text-[13px] h-[300px] overflow-y-auto custom-scrollbar shadow-inner relative">
                  <div className="sticky top-0 bg-black/80 backdrop-blur px-2 py-1 border-b border-white/5 mb-4 flex justify-between">
                    <span className="text-gray-500 text-[10px]">root@ubuntu:/var/log/squid/access.log</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500/40"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500/40"></div>
                    </div>
                  </div>
                  {logs.map((log, i) => (
                    <div key={i} className={`mb-1.5 leading-relaxed ${
                      log.startsWith('!') ? 'text-red-400 font-bold bg-red-500/5 p-1 rounded' : 
                      log.startsWith('>') ? 'text-blue-300' : 'text-green-500/70'
                    }`}>
                      <span className="opacity-20 mr-2">{new Date().toLocaleTimeString()}</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div className="bg-ubuntu/10 border border-ubuntu/20 p-8 rounded-[2rem]">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Info className="text-ubuntu" /> Implementación Profesional
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    En un entorno de producción con Ubuntu, las ACL (Access Control Lists) son el mecanismo principal para definir quién, cuándo y hacia dónde se puede navegar.
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <h4 className="font-bold text-xl mb-6">Pasos en Ubuntu</h4>
                    <ul className="space-y-4 text-gray-400">
                      <li className="flex gap-3"><span className="text-ubuntu font-bold">01.</span> Instalar Squid: <code className="text-white bg-black px-2 py-1 rounded">apt install squid</code></li>
                      <li className="flex gap-3"><span className="text-ubuntu font-bold">02.</span> Editar Config: <code className="text-white bg-black px-2 py-1 rounded">nano /etc/squid/squid.conf</code></li>
                      <li className="flex gap-3"><span className="text-ubuntu font-bold">03.</span> Definir ACLs al inicio del archivo.</li>
                      <li className="flex gap-3"><span className="text-ubuntu font-bold">04.</span> Reiniciar: <code className="text-white bg-black px-2 py-1 rounded">systemctl restart squid</code></li>
                    </ul>
                  </div>
                  <div className="bg-black p-8 rounded-[2rem] border border-white/10">
                    <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-ubuntu"><Code size={20} /> Estructura squid.conf</h4>
                    <pre className="text-xs text-green-400/80 leading-loose">
                      {`# Definición de la red\nacl lan_internal src 192.168.1.0/24\n\n# Definición de sitios prohibidos\nacl block_list dstdomain "/etc/squid/blocked.txt"\n\n# Aplicación de reglas\nhttp_access deny block_list\nhttp_access allow lan_internal\nhttp_port 3128`}
                    </pre>
                  </div>
               </div>
            </motion.div>
          )}
        </section>

        {/* Panel Detalle de ACL (Derecha) */}
        <aside className="w-full lg:w-96">
           <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 sticky top-28">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Inspector de Regla Activa</h4>
              <div className="space-y-6">
                 <div>
                    <span className="text-[10px] text-ubuntu font-bold uppercase tracking-tighter">Nombre del Objeto</span>
                    <div className="text-xl font-bold mt-1">{selectedACL.name}</div>
                 </div>
                 <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Sintaxis Ubuntu/Squid</span>
                    <div className="mt-3 bg-black rounded-2xl p-6 border border-white/10 relative group">
                       <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity">
                          <Code size={14} />
                       </div>
                       <code className="text-xs text-blue-300 font-mono leading-relaxed whitespace-pre-wrap">
                          {selectedACL.code}
                       </code>
                    </div>
                 </div>
                 <div className={`p-6 rounded-2xl border ${selectedACL.status === 'allow' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                    <div className="flex items-center gap-3">
                       {selectedACL.status === 'allow' ? <ShieldCheck className="text-green-500" /> : <ShieldAlert className="text-red-500" />}
                       <div>
                          <div className={`font-bold text-sm ${selectedACL.status === 'allow' ? 'text-green-500' : 'text-red-500'}`}>
                             Acción: {selectedACL.status.toUpperCase()}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">
                             {selectedACL.status === 'allow' ? 'El tráfico será encapsulado y enviado al destino.' : 'El Proxy cortará la conexión y enviará un error 403.'}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </aside>
      </main>

      <footer className="mt-20 border-t border-white/5 py-12 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="text-gray-500 text-[11px] font-medium tracking-wide">
               PROYECTO FINAL DE REDES Y SERVICIOS LINUX © 2026
             </div>
             <div className="h-4 w-px bg-white/10 hidden md:block"></div>
             <div className="text-gray-600 text-[11px] italic">Desarrollado para demostración académica.</div>
          </div>
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400">NEXT.JS 14</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400">SQUID ENGINE</span>
            <span className="px-3 py-1 bg-ubuntu/10 border border-ubuntu/20 rounded-full text-[10px] font-bold text-ubuntu">UBUNTU READY</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(233, 84, 32, 0.2);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #E95420;
        }
      `}</style>
    </div>
  );
}