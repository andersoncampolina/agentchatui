import { NextRequest, NextResponse } from 'next/server';

interface InputItem {
  type: string;
  text?: string;
  image_url?: {
    url: string;
  };
}

export async function POST(req: NextRequest) {
  const { prompt, images } = await req.json();

  if (!prompt && (!images || images.length === 0)) {
    return NextResponse.json(
      { error: 'You must provide a prompt, an image, or both.' },
      { status: 400 }
    );
  }

  // Build input array
  const input: InputItem[] = [];

  if (prompt) {
    input.push({
      type: 'text',
      text: prompt,
    });
  }

  if (images && Array.isArray(images)) {
    for (const image of images) {
      if (typeof image === 'string' && image.startsWith('data:image/')) {
        input.push({
          type: 'image_url',
          image_url: {
            url: image,
          },
        });
      } else {
        return NextResponse.json(
          { error: 'Each image must be a valid base64 data URL.' },
          { status: 400 }
        );
      }
    }
  }

  try {
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        input,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ output: data.output_text });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unexpected error', detail: String(error) },
      { status: 500 }
    );
  }
}
