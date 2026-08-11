export async function fetchGroqChatCompletion(
  userQuery: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
  isVoice: boolean = false
): Promise<string | null> {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const res = await fetch(`${basePath}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userQuery,
        history,
        isVoice,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('Groq Chat Proxy Error:', res.status, errText);
      return null;
    }

    const data = await res.json();
    return data.content || null;
  } catch (error) {
    console.error('Error fetching Groq completion proxy:', error);
    return null;
  }
}

export async function fetchFishAudioTts(textToSpeak: string): Promise<string | null> {
  try {
    const cleanText = textToSpeak.replace(/[*#•🚀🎮🎓✉️💻⚡]/g, '').trim();
    if (!cleanText) return null;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const proxyRes = await fetch(`${basePath}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText }),
    });

    if (proxyRes.ok) {
      const arrayBuffer = await proxyRes.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
      return URL.createObjectURL(blob);
    }

    console.warn('TTS proxy returned status:', proxyRes.status);
    return null;
  } catch (error) {
    console.error('Error fetching Fish Audio TTS proxy:', error);
    return null;
  }
}
