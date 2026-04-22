import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({
    message: "¡Hola! Soy el servidor de destino final.",
    received_data: body,
    timestamp: new Date().toISOString(),
    server_info: "Ubuntu Server 22.04 LTS (Simulado)"
  });
}