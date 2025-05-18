import { NextResponse } from 'next/server';

// Extend the Next.js API timeout to 5 minutes
export const maxDuration = 300; // 5 minutes in seconds

export async function POST(request: Request) {
  try {
    // Parse the incoming request as FormData
    const formData = await request.formData();
    console.log('Received FormData request');

    const username = process.env.N8N_USERNAME;
    const password = process.env.N8N_PASSWORD;
    const isProduction: boolean =
      process.env.ENVIRONMENT === 'production' ? true : false;

    // Get webhook ID from FormData
    const webhookId = (formData.get('webhookId') as string) || 'conversation';

    // Determine webhook URL based on environment
    let webhookUrl;
    if (isProduction) {
      webhookUrl = `https://n8n.renthub.com.br/webhook/${webhookId}`;
    } else {
      webhookUrl = `https://n8n.renthub.com.br/webhook-test/${webhookId}`;
    }

    // Create basic authentication header
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

    // Forward the FormData directly to n8n
    // We need to create a new FormData to avoid sending the webhookId
    const n8nFormData = new FormData();

    // Copy all entries except webhookId
    formData.forEach((value, key) => {
      if (key !== 'webhookId') {
        n8nFormData.append(key, value);
      }
    });

    // Create an AbortController with a longer timeout (4 minutes)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 240000); // 4 minutes in milliseconds

    try {
      // Send the request to n8n with the AbortController signal
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
        body: n8nFormData,
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear the timeout if request completes

      if (!response.ok) {
        throw new Error(`n8n responded with status ${response.status}`);
      }

      const responseData = await response.json();
      return NextResponse.json(responseData);
    } catch (fetchError: unknown) {
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Request to n8n timed out after 4 minutes');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId); // Ensure timeout is cleared
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error in n8nWebhook route: ${errorMessage}`);
    return NextResponse.json(
      { error: `Failed to process request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
