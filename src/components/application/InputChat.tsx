/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  useState,
  KeyboardEvent,
  useEffect,
  useRef,
  DragEvent,
  ClipboardEvent,
} from 'react';
import FormatMarkdown from '../common/FormatMarkDown';
import { PulseLoader } from 'react-spinners';
import { Tooltip } from '../common/Tooltip';
import { MicrophoneButton } from './MicrophoneButton';
import { X } from 'lucide-react';

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

export function InputChat({ model = 'gpt-4o-mini' }: InputChatProps) {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState(
    process.env.ENENVIRONMENT == 'production' ? 200 : 1000
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, imageUrl]);

  // Keep focus on input field
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  // Handle drag events
  const handleDragOver = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        handleImageUpload(file);
      }
    }
  };

  // Handle paste event
  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleImageUpload(file);
          break;
        }
      }
    }
  };

  // Convert file to base64
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setUploadedImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Clear uploaded image
  const clearUploadedImage = () => {
    setUploadedImage(null);
  };

  const handleSubmit = async (userInput: string) => {
    if (!userInput.trim() && !uploadedImage) return;

    // Create a copy of userInput for the API call
    const message = userInput;

    // Clear input immediately after submission
    setUserInput('');

    // adiciona dentro de messages o userInput
    setMessages([
      ...(messages || []),
      {
        lc: 1,
        type: 'constructor',
        id: ['langchain_core', 'messages', 'HumanMessage'],
        kwargs: {
          content: uploadedImage ? `${message} [Image attached]` : message,
          additional_kwargs: {},
          response_metadata: {},
        },
      },
    ]);

    setIsLoading(true);

    // Extract base64 data without the data URL prefix
    let imageData = null;
    if (uploadedImage) {
      const base64Match = uploadedImage.match(
        /^data:image\/(png|jpeg|jpg|gif);base64,(.*)$/
      );
      if (base64Match) {
        imageData = base64Match[2];
      }
    }

    try {
      const response = await fetch('/api/n8nWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: message,
          image: imageData,
          webhookId:
            process.env.ENVIRONMENT === 'production'
              ? 'conversation'
              : 'conversation-teste',
          conversationId: conversationId.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Process the response data
      let responseMessages = null;
      let responseImageUrl = null;

      // Check if data is an array and has messages property
      if (Array.isArray(data) && data.length > 0) {
        if (data[0]?.image) {
          responseImageUrl = data[0].image;
        }
        if (data[0]?.messages) {
          responseMessages = data[0].messages;
        } else if (data[0]?.image) {
          // Create a default message if only image is returned in an array
          responseMessages = [
            {
              lc: 1,
              type: 'constructor',
              id: ['langchain_core', 'messages', 'AIMessage'],
              kwargs: {
                content: 'Here is the image you requested:',
                additional_kwargs: {},
                response_metadata: {
                  image_url: data[0].image,
                },
              },
            },
          ];
        }
      } else {
        if (data.image) {
          responseImageUrl = data.image;
        }
        if (data.messages) {
          responseMessages = data.messages;
        } else {
          // Create a default message if only image is returned
          responseMessages = [
            {
              lc: 1,
              type: 'constructor',
              id: ['langchain_core', 'messages', 'AIMessage'],
              kwargs: {
                content: 'Here is the image you requested:',
                additional_kwargs: {},
                response_metadata: {
                  image_url: data.image,
                },
              },
            },
          ];
        }
      }

      // If we have an image URL, add it to the AI message's response_metadata
      if (responseImageUrl && responseMessages) {
        // Find the last AI message to add the image to
        const lastAiMessageIndex = responseMessages
          .map((msg: Message, idx: number) => ({ msg, idx }))
          .filter(
            ({ msg }: { msg: Message }) => !msg.id.includes('HumanMessage')
          )
          .pop()?.idx;

        if (lastAiMessageIndex !== undefined) {
          // Add the image URL to the response_metadata of the AI message
          responseMessages[lastAiMessageIndex] = {
            ...responseMessages[lastAiMessageIndex],
            kwargs: {
              ...responseMessages[lastAiMessageIndex].kwargs,
              response_metadata: {
                ...responseMessages[lastAiMessageIndex].kwargs
                  .response_metadata,
                image_url: responseImageUrl,
              },
            },
          };
        }
      }

      // Update state with processed data
      setImageUrl(responseImageUrl);
      setMessages(responseMessages);
    } catch (error: unknown) {
      console.error('Failed to send message:', error);
      // Create an error message in the same format as the messages
      const errorMessage: Message = {
        lc: 1,
        type: 'constructor',
        id: ['langchain_core', 'messages', 'AIMessage'],
        kwargs: {
          content: `Error: ${
            error instanceof Error ? error.message : 'Unknown error occurred'
          }`,
          additional_kwargs: {},
          response_metadata: {},
        },
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
      setUploadedImage(null); // Clear the uploaded image after sending
    }
  };

  // Handle audio recording from microphone button
  const handleAudioRecorded = async (audioBase64: string) => {
    setIsLoading(true);

    // Add a message indicating audio was sent
    setMessages([
      ...(messages || []),
      {
        lc: 1,
        type: 'constructor',
        id: ['langchain_core', 'messages', 'HumanMessage'],
        kwargs: {
          content: '[Audio message]',
          additional_kwargs: {},
          response_metadata: {},
        },
      },
    ]);

    try {
      const response = await fetch('/api/n8nWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          audioBase64,
          webhookId:
            process.env.ENVIRONMENT === 'production'
              ? 'conversation'
              : 'conversation-teste',
          conversationId: conversationId.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Process the response data
      let responseMessages = null;
      let responseImageUrl = null;

      // Check if data is an array and has messages property
      if (Array.isArray(data) && data.length > 0) {
        if (data[0]?.image) {
          responseImageUrl = data[0].image;
        }
        if (data[0]?.messages) {
          responseMessages = data[0].messages;
        } else if (data[0]?.image) {
          // Create a default message if only image is returned in an array
          responseMessages = [
            {
              lc: 1,
              type: 'constructor',
              id: ['langchain_core', 'messages', 'AIMessage'],
              kwargs: {
                content: 'Here is the image you requested:',
                additional_kwargs: {},
                response_metadata: {
                  image_url: data[0].image,
                },
              },
            },
          ];
        }
      } else {
        if (data.image) {
          responseImageUrl = data.image;
        }
        if (data.messages) {
          responseMessages = data.messages;
        } else if (data.image) {
          // Create a default message if only image is returned
          responseMessages = [
            {
              lc: 1,
              type: 'constructor',
              id: ['langchain_core', 'messages', 'AIMessage'],
              kwargs: {
                content: 'Here is the image you requested:',
                additional_kwargs: {},
                response_metadata: {
                  image_url: data.image,
                },
              },
            },
          ];
        } else {
          // Create a fallback message if no messages are found
          responseMessages = [
            {
              lc: 1,
              type: 'constructor',
              id: ['langchain_core', 'messages', 'AIMessage'],
              kwargs: {
                content:
                  'Received response but no messages were found in the data.',
                additional_kwargs: {},
                response_metadata: {},
              },
            },
          ];
        }
      }

      // If we have an image URL, add it to the AI message's response_metadata
      if (responseImageUrl && responseMessages) {
        // Find the last AI message to add the image to
        const lastAiMessageIndex = responseMessages
          .map((msg: Message, idx: number) => ({ msg, idx }))
          .filter(
            ({ msg }: { msg: Message }) => !msg.id.includes('HumanMessage')
          )
          .pop()?.idx;

        if (lastAiMessageIndex !== undefined) {
          // Add the image URL to the response_metadata of the AI message
          responseMessages[lastAiMessageIndex] = {
            ...responseMessages[lastAiMessageIndex],
            kwargs: {
              ...responseMessages[lastAiMessageIndex].kwargs,
              response_metadata: {
                ...responseMessages[lastAiMessageIndex].kwargs
                  .response_metadata,
                image_url: responseImageUrl,
              },
            },
          };
        }
      }

      // Update state with processed data
      setImageUrl(responseImageUrl);
      setMessages(responseMessages);
    } catch (error: unknown) {
      console.error('Failed to send audio message:', error);
      // Create an error message in the same format as the messages
      const errorMessage: Message = {
        lc: 1,
        type: 'constructor',
        id: ['langchain_core', 'messages', 'AIMessage'],
        kwargs: {
          content: `Error: ${
            error instanceof Error ? error.message : 'Unknown error occurred'
          }`,
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

  // Function to clear conversation and increment conversationId
  const handleClearConversation = () => {
    setMessages(null);
    setImageUrl(null);
    setUserInput('');
    setUploadedImage(null);
    setConversationId((prevId) => prevId + 1);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl gap-4 items-center px-2 sm:px-4">
      <div className="w-full rounded-md overflow-x-hidden overflow-y-auto pb-20 p-2">
        {messages && (
          <div className="flex flex-col gap-4 pb-20 w-full max-w-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 sm:p-4 rounded-lg ${
                  isHumanMessage(message)
                    ? 'ml-auto max-w-[90%] sm:max-w-[80%] shadow-[0_0_10px_rgba(107,114,128,0.6)] border-[1px] font-semibold border-[var(--quaternary-color)] bg-[var(--secondary-color)]'
                    : 'mr-auto max-w-[90%] sm:max-w-[80%] shadow-[0_0_10px_rgba(107,114,128,0.6)] border-[1px] font-semibold border-[var(--quaternary-color)] bg-white text-[var(--primary-color)] font-mono'
                } overflow-hidden break-words w-fit`}
              >
                <div className="bg-transparent w-full max-w-full overflow-hidden">
                  {!isHumanMessage(message) &&
                    message.kwargs.response_metadata?.image_url && (
                      <div className="mb-4">
                        <img
                          src={message.kwargs.response_metadata.image_url}
                          alt="Generated Image"
                          className="w-full h-auto rounded-md"
                        />
                      </div>
                    )}
                  <FormatMarkdown isHumanMessage={isHumanMessage(message)}>
                    {message.kwargs.content}
                  </FormatMarkdown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 pb-2 sm:pb-5 flex items-center w-full justify-center bg-transparent">
        <div className="flex flex-col items-center w-full max-w-[95%] sm:max-w-3xl px-2 sm:px-4 gap-2 sm:gap-3 bg-transparent">
          {uploadedImage && (
            <div className="relative bg-white/60 backdrop-blur rounded-md p-1 self-start">
              <img
                src={uploadedImage}
                alt="Upload preview"
                className="h-[70px] w-auto object-contain rounded"
              />
              <button
                onClick={clearUploadedImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="flex items-center w-full gap-2 sm:gap-3">
            <Tooltip text="Start a new conversation">
              <Button
                className="pt-1 rounded-full cursor-pointer font-extrabold bg-[var(--primary-color)] backdrop-blur h-10 w-10 sm:h-12 sm:w-12 text-xl sm:text-2xl flex-shrink-0"
                onClick={handleClearConversation}
                type="button"
                disabled={isLoading}
                title="Clear conversation"
              >
                +
              </Button>
            </Tooltip>
            <Textarea
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onPaste={handlePaste}
              className="bg-white/60 backdrop-blur rounded-md"
              placeholder="Ask anything... (drag & drop or paste images)"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageUpload(e.target.files[0]);
                }
              }}
            />
            <MicrophoneButton
              onAudioRecorded={handleAudioRecorded}
              disabled={isLoading}
            />
            <Tooltip text="Send message">
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
                      backgroundColor: 'var(--primary-color)',
                    }}
                  />
                ) : (
                  '↑'
                )}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputChat;
