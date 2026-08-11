import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    const apiKey = process.env.FISH_AUDIO_API_KEY || process.env.NEXT_PUBLIC_FISH_AUDIO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Fish Audio API key not configured' }, { status: 500 });
    }

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
        reference_id: '802e3bc2b27e49c2995d23ef70e6ac89',
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
