import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { url, headers } = body;

  console.log(`[PROXY] Interceptando petición a: ${url}`);
  
  try {
    // Simulamos un retraso de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // El proxy reenvía la petición al servidor de destino real (o simulado)
    const targetResponse = await fetch(`${new URL(request.url).origin}/api/target`, {
      method: 'POST',
      headers: {
        ...headers,
        'X-Proxy-By': 'Ubuntu-Demo-Proxy',
      },
      body: JSON.stringify({ message: "Petición procesada por Proxy Ubuntu" })
    });

    const data = await targetResponse.json();
    
    return NextResponse.json({
      status: 'success',
      proxy_logs: [
        `Petición recibida de Cliente`,
        `Modificando cabeceras...`,
        `Reenviando a ${url}`,
        `Respuesta recibida de Destino`,
        `Devolviendo datos a Cliente`
      ],
      data
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Error en el Proxy' }, { status: 500 });
  }
}