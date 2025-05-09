import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  console.log('BODY: ', body);
  const username = process.env.N8N_USERNAME;
  const password = process.env.N8N_PASSWORD;

  const isProduction: boolean = process.env.ENVIRONMENT === 'production';

  let webhookUrl;

  if (isProduction) {
    webhookUrl = `https://n8n.renthub.com.br/webhook/${body.webhookId}`;
  } else {
    webhookUrl = `https://n8n.renthub.com.br/webhook-test/${body.webhookId}`;
  }

  // Create basic authentication header
  const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

  // Create a JSON payload
  const jsonPayload: Record<string, any> = {
    model: body.model,
    prompt: body.prompt,
    webhookId: body.webhookId,
    conversationId: body.conversationId,
  };

  // Process all properties in the body object
  for (const [key, value] of Object.entries(body)) {
    // Handle image fields specially - convert to base64
    if (key === 'image' && typeof value === 'string') {
      try {
        const imageResponse = await fetch(value);
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');

        // Get the mime type from the response
        const contentType =
          imageResponse.headers.get('content-type') || 'image/jpeg';

        // Format as data URL
        jsonPayload[key] = `data:${contentType};base64,${base64Image}`;
      } catch (error) {
        console.error(`Failed to fetch and encode image: ${error}`);
      }
    }
    // Handle all other fields normally
    else if (value !== undefined && value !== null) {
      jsonPayload[key] = value;
    }
  }

  // Send request with JSON body
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonPayload),
    cache: 'no-store',
  });

  const responseData = await response.json();

  // Return the response from the webhook as a JSON object
  return NextResponse.json(responseData);
}
