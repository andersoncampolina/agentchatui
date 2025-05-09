'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import FadeInText from '../common/FadeInText';
import FormatMarkdown from '../common/FormatMarkDown';

interface InputChatProps {
  model?: string;
}

export function InputChat({ model = 'gpt-4.1' }: InputChatProps) {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<any | null>(null);
  const [image, setImage] = useState<any | null>(null);

  const handleSubmit = async (userInput: string) => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setText(null);

    try {
      const response = await fetch('/api/n8nWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: userInput,
          webhookId: 'conversation',
          conversationId: '123',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('DATA: ', data);
      // setText(JSON.stringify(data, null, 2));
      if (data.b64_json) setImage(data.b64_json);
      if (data[0].output) setText(data[0].output);

      // Clear input after successful submission
      setUserInput('');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      setText(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-full gap-4 items-center">
      <div className="rounded-md overflow-auto pb-20">
        {image && (
          <div className="flex flex-col gap-10 pb-20 max-w-7xl">
            <img
              src={`data:image/png;base64,${image}`}
              alt="Generated Image"
              className="w-full h-auto"
            />
          </div>
        )}
        {text && (
          <div className="flex flex-col gap-10 pb-20 max-w-7xl p-8">
            {/* <FadeInText> */}
            <FormatMarkdown>{text}</FormatMarkdown>
            {/* </FadeInText> */}
          </div>
        )}
      </div>
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
