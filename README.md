# 🛡️ Proxy Service Demonstration - Ubuntu Project

Este proyecto es una demostración interactiva y profesional de cómo funciona un servicio Proxy en un entorno **Ubuntu**. Diseñado como un proyecto final, combina una interfaz web moderna con una simulación real de flujo de paquetes.

## 🚀 Características
- **Diagrama Dinámico:** Animaciones en tiempo real que muestran el flujo Cliente -> Proxy -> Servidor.
- **Simulación Real:** Backend con Next.js que actúa como intermediario (Proxy).
- **Consola de Logs:** Panel estilo terminal de Ubuntu que muestra las cabeceras y peticiones procesadas.
- **Guía Técnica:** Documentación integrada sobre configuración de Nginx y Squid en Ubuntu.

## 🛠️ Tecnologías Utilizadas
- **Next.js 14** (App Router)
- **Tailwind CSS** (Estilos profesionales)
- **Framer Motion** (Animaciones de red)
- **Lucide React** (Iconografía)

## 💻 Instalación en Ubuntu

Para ejecutar este proyecto en tu servidor Ubuntu:

1. **Instalar Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/xllnyxthornllx/Proxy.git
   cd Proxy
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

El proyecto estará disponible en `http://localhost:3000`.

---
Desarrollado para la demostración de servicios de red en Linux/Ubuntu.