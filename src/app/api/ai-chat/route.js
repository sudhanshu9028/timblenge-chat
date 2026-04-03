import { NextResponse } from 'next/server';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent';

export async function POST(request) {
  try {
    const { systemPrompt, conversationHistory } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'No API key configured' }, { status: 503 });
    }

    // Build contents array for Gemini API
    const contents = [];

    for (const msg of conversationHistory) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      });
    }

    // Append current time context so the bot doesn't fabricate times
    const now = new Date();
    const timeContext = `\n\nCurrent UTC time: ${now.toUTCString()}. Use this to reference time accurately based on your character's timezone. Do NOT make up a time.`;
    const fullPrompt = systemPrompt + timeContext;

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: fullPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 60,
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return NextResponse.json({ error: 'Gemini API failed' }, { status: 502 });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 502 });
    }

    return NextResponse.json({ message: text }, { status: 200 });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
