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

  // Create FormData and add required fields
  const formData = new FormData();

  // Loop through all properties in the body object and append them to formData
  for (const [key, value] of Object.entries(body)) {
    // Handle image fields specially
    if (key === 'image' && typeof value === 'string') {
      try {
        const imageBlob = await fetch(value).then((r) => r.blob());
        formData.append(key, imageBlob, 'image.jpg');
      } catch (error) {
        console.error(`Failed to fetch image: ${error}`);
      }
    }
    // Handle all other fields
    else if (value !== undefined && value !== null) {
      // Convert objects/arrays to strings if needed
      const fieldValue =
        typeof value === 'object' ? JSON.stringify(value) : value.toString();
      formData.append(key, fieldValue);
    }
  }

  // Send request with FormData
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
    },
    body: formData,
    cache: 'no-store',
  });

  const responseData = await response.json();

  // Return the response from the webhook as a JSON object
  return NextResponse.json(responseData);
}
