'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, KeyboardEvent } from 'react';
import FormatMarkdown from '../common/FormatMarkDown';
import { PulseLoader } from 'react-spinners';

interface Message {
  lc: number;
  type: string;
  id: string[];
  kwargs: {
    content: string;
    tool_calls?: any[];
    invalid_tool_calls?: any[];
    additional_kwargs: any;
    response_metadata: any;
  };
}

interface InputChatProps {
  model?: string;
}

export function InputChat({ model = 'gpt-4.1' }: InputChatProps) {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [image, setImage] = useState<any | null>(null);

  const handleSubmit = async (userInput: string) => {
    if (!userInput.trim()) return;

    setIsLoading(true);

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

      if (data.b64_json) setImage(data.b64_json);

      // Check if data is an array and has messages property
      if (Array.isArray(data) && data.length > 0 && data[0]?.messages) {
        setMessages(data[0].messages);
      } else if (data.messages) {
        // If messages are directly on the data object
        setMessages(data.messages);
      } else {
        // Create a fallback message if no messages are found
        const fallbackMessage: Message = {
          lc: 1,
          type: 'constructor',
          id: ['langchain_core', 'messages', 'AIMessage'],
          kwargs: {
            content:
              'Received response but no messages were found in the data.',
            additional_kwargs: {},
            response_metadata: {},
          },
        };
        setMessages([fallbackMessage]);
      }

      // Clear input after successful submission
      setUserInput('');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      // Create an error message in the same format as the messages
      const errorMessage: Message = {
        lc: 1,
        type: 'constructor',
        id: ['langchain_core', 'messages', 'AIMessage'],
        kwargs: {
          content: `Error: ${error.message || 'Unknown error occurred'}`,
          additional_kwargs: {},
          response_metadata: {},
        },
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press to submit the message
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(userInput);
    }
  };

  // Helper function to determine message type
  const isHumanMessage = (message: Message) => {
    return message.id.includes('HumanMessage');
  };

  return (
    <div className="flex flex-col w-full max-w-4xl gap-4 items-center">
      <div className="w-full rounded-md overflow-x-hidden overflow-y-auto pb-20">
        {image && (
          <div className="flex flex-col gap-6 pb-10 w-full max-w-full px-2 sm:px-4">
            <img
              src={`data:image/png;base64,${image}`}
              alt="Generated Image"
              className="w-full h-auto rounded-md"
            />
          </div>
        )}
        {messages && (
          <div className="flex flex-col gap-4 pb-20 w-full max-w-full px-2 sm:px-4 md:px-8">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 sm:p-4 rounded-lg ${
                  isHumanMessage(message)
                    ? 'ml-auto max-w-[90%] sm:max-w-[80%] shadow-[0_0_10px_rgba(59,130,246,0.9)] border-[1px] border-[var(--quaternary-color)]'
                    : 'mr-auto max-w-[90%] sm:max-w-[80%] shadow-[0_0_10px_rgba(107,114,128,0.9)] border-[1px] border-[var(--quaternary-color)]'
                } overflow-hidden break-words w-fit`}
                style={{ maxWidth: 'calc(100vw - 16px)' }}
              >
                <div className="w-full max-w-full overflow-hidden">
                  <FormatMarkdown>{message.kwargs.content}</FormatMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 pb-2 sm:pb-5 flex items-center w-full justify-center bg-transparent">
        <div className="flex items-center w-full max-w-[95%] sm:max-w-3xl px-2 sm:px-4 gap-2 sm:gap-3 bg-transparent">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-white/60 backdrop-blur rounded-md"
            placeholder="Ask anything..."
            disabled={isLoading}
          />
          <Button
            className="rounded-full cursor-pointer font-extrabold bg-[var(--primary-color)] backdrop-blur h-10 w-10 sm:h-12 sm:w-12 text-xl sm:text-2xl flex-shrink-0"
            onClick={() => handleSubmit(userInput)}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <PulseLoader
                size={6}
                color="white"
                style={{
                  alignItems: 'center',
                  display: 'flex',
                }}
              />
            ) : (
              '↑'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InputChat;
