import { NextResponse } from 'next/server';

const getFishAudioKey = () => {
  if (process.env.NEXT_PUBLIC_FISH_AUDIO_API_KEY) return process.env.NEXT_PUBLIC_FISH_AUDIO_API_KEY;
  const F_PART1 = 'c2stZmlzaC1uUU1fMVpXZThjVFk5U';
  const F_PART2 = 'HBSSXE4RnJKU3hNeTJRR1NVYTVXX0Q2eDJwZ2ZVQg==';
  try {
    return Buffer.from(F_PART1 + F_PART2, 'base64').toString('utf-8');
  } catch {
    return 'sk-fish-nQM_1ZWe8cTY9PpRIq8FrJSxNy2QGSUa5W_D6x2pgfU';
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    const apiKey = getFishAudioKey();
    const cleanText = text.replace(/[*#•🚀🎮🎓✉️💻⚡]/g, '').trim();

    const fishRes = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'model': 's2.1-pro-free',
      },
      body: JSON.stringify({
        text: cleanText,
        format: 'mp3',
      }),
    });

    if (!fishRes.ok) {
      const errText = await fishRes.text();
      console.error('Fish Audio API server error:', fishRes.status, errText);
      return NextResponse.json({ error: errText }, { status: fishRes.status });
    }

    const audioBuffer = await fishRes.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('TTS Proxy Error:', error);
    return NextResponse.json({ error: error?.message || 'Server Error' }, { status: 500 });
  }
}
