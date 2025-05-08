'use client';

import { useRef, useState } from 'react';

export default function RealtimePage() {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [status, setStatus] = useState('Aguardando...');

  async function start() {
    setStatus('Iniciando...');

    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    const dataChannel = pc.createDataChannel('events');

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const sessionRes = await fetch('/api/openai/session', {
      method: 'POST',
      //   body: JSON.stringify({}) // caso queira mudar model e voice,
    });
    const session = await sessionRes.json();

    const rtcRes = await fetch('https://api.openai.com/v1/realtime/webrtc', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.client_secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sdp: offer.sdp }),
    });

    const { sdp: answerSdp } = await rtcRes.json();
    await pc.setRemoteDescription(
      new RTCSessionDescription({ type: 'answer', sdp: answerSdp })
    );

    setStatus('Conectado com o GPT-4o via WebRTC');
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Teste GPT-4o WebRTC</h1>
      <button
        onClick={start}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Iniciar
      </button>
      <p className="mt-4">{status}</p>
    </div>
  );
}
