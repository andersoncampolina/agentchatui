import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  if (!input) {
    return NextResponse.json({ error: 'Missing input' }, { status: 400 });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        input,
      }),
    });

    if (!openaiRes.ok) {
      const error = await openaiRes.json();
      return NextResponse.json({ error }, { status: openaiRes.status });
    }

    const data = await openaiRes.json();

    return NextResponse.json({ output: data.output_text });
  } catch (err) {
    return NextResponse.json(
      { error: 'Unexpected error', detail: String(err) },
      { status: 500 }
    );
  }
}
