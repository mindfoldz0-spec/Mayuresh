import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    // Forward to Groq Whisper API for transcription
    const groqFormData = new FormData();
    groqFormData.append('file', audioFile, 'recording.webm');
    groqFormData.append('model', 'whisper-large-v3-turbo');
    groqFormData.append('language', 'en');
    groqFormData.append('response_format', 'json');

    const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: groqFormData,
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq Whisper API error:', groqRes.status, errText);
      return NextResponse.json({ error: errText }, { status: groqRes.status });
    }

    const data = await groqRes.json();
    return NextResponse.json({ text: data.text || '' });
  } catch (error: any) {
    console.error('STT Proxy Error:', error);
    return NextResponse.json({ error: error?.message || 'Server Error' }, { status: 500 });
  }
}
