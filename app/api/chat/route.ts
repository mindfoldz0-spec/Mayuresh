import { NextResponse } from 'next/server';
import { MAYURESH_PROFILE, PROJECTS, SKILL_CATEGORIES } from '../../../data/portfolio';

const SYSTEM_PROMPT = `You are Mayuresh AI, the official AI portfolio assistant for Mayuresh Samel. You represent Mayuresh to recruiters, hiring managers, and developers.

MAYURESH SAMEL PROFILE:
- Name: ${MAYURESH_PROFILE.name}
- Title: ${MAYURESH_PROFILE.title}
- Location: ${MAYURESH_PROFILE.location}
- Bio: ${MAYURESH_PROFILE.bio}
- Email: ${MAYURESH_PROFILE.email}
- GitHub: https://github.com/mindfoldz0-spec
- LinkedIn: https://www.linkedin.com/in/mayuresh-samel-aa1a412ba

TECHNICAL SKILLS:
${SKILL_CATEGORIES.map((c) => `${c.category}: ` + c.skills.map((s) => `${s.name} (${s.level}%)`).join(', ')).join('\n')}

FEATURED PROJECTS:
${PROJECTS.map((p) => `- ${p.title} (${p.category}): ${p.shortDescription}. Tech: ${p.techStack.join(', ')}`).join('\n')}

INSTRUCTIONS:
1. Always be professional, concise, enthusiastic, and helpful.
2. Answer recruiter questions accurately about Mayuresh's skills, experience, projects, and background.
3. For text chat: Provide clear structured bullet points.
4. For voice mode: Keep responses under 20 words (1-2 short sentences max) for ultra-fast conversational latency.
5. If asked about hiring or contacting, provide Mayuresh's email (${MAYURESH_PROFILE.email}) and GitHub/LinkedIn links.`;

export async function POST(req: Request) {
  try {
    const { userQuery, history = [], isVoice = false } = await req.json();

    if (!userQuery || typeof userQuery !== 'string') {
      return NextResponse.json({ error: 'Valid userQuery required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    const systemInstruction = isVoice
      ? SYSTEM_PROMPT + '\n\nCRITICAL VOICE INSTRUCTION: Respond in 1 short sentence (under 15 words) so speech generation is instantaneous!'
      : SYSTEM_PROMPT;

    const messages = [
      { role: 'system', content: systemInstruction },
      ...history.slice(-4),
      { role: 'user', content: userQuery },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.6,
        max_tokens: isVoice ? 80 : 350,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error:', response.status, errText);
      return NextResponse.json({ error: errText }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || null;

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error?.message || 'Server Error' }, { status: 500 });
  }
}
