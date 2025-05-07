'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import FadeInText from '../common/FadeInText';

export function InputChat() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any | null>(null);
  const [responseImage, setResponseImage] = useState<any | null>(null);

  const handleSubmit = async (userInput: string) => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const response = await fetch('/api/n8nWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: userInput,
          webhookId: 'pixerize',
          // timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
      if (data.b64_json) setResponseImage(data.b64_json);

      // Clear input after successful submission
      setUserInput('');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      setResponse(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-full gap-4 items-center">
      {/* {response && ( */}
      <div className="rounded-md overflow-auto pb-20">
        {/* {responseImage && ( */}
        <div className="flex flex-col gap-10 pb-20 max-w-7xl">
          {/* <img
              src={`data:image/png;base64,${responseImage}`}
              alt="Generated Image"
              className="w-full h-auto"
            /> */}
          <img
            src={
              'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/1280px-Sunflower_from_Silesia2.jpg'
            }
            alt="Generated Image"
            className="w-full h-auto rounded-2xl"
          />
          {/* <p className="text-sm">{response.prompt}</p> */}
          <FadeInText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Sed ut
            perspiciatis unde omnis iste natus error sit voluptatem accusantium
            doloremque laudantium.
          </FadeInText>
        </div>
        {/* )} */}
      </div>
      {/* )} */}
      <div className="fixed bottom-0 left-0 right-0 pb-5 flex items-center w-full justify-center bg-transparent">
        <div className="flex items-center w-full max-w-3xl p-4 gap-3 bg-transparent">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="bg-white/60 backdrop-blur"
            placeholder="Ask anything..."
            disabled={isLoading}
          />
          <Button
            className="rounded-full p-3.5 cursor-pointer font-extrabold bg-black/80 backdrop-blur"
            onClick={() => handleSubmit(userInput)}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? '...' : '↑'}
          </Button>
        </div>
      </div>
    </div>
  );
}
