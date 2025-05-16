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
import FormatMarkdown from './ui/FormatMarkDown';
import { PulseLoader } from 'react-spinners';
import { Tooltip } from './ui/Tooltip';
import { MicrophoneButton } from './ui/MicrophoneButton';
import { X } from 'lucide-react';
import { Message, InputChatProps } from './types';
import {
  createHumanMessage,
  createAIMessage,
  processApiResponse,
  handleImageUpload as handleImageUploadUtil,
} from './utils';

export function InputChat({ model = 'gpt-4o-mini' }: InputChatProps) {
  // State management
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState(
    process.env.ENVIRONMENT === 'production' ? 200 : 1000
  );

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll and focus effects
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, imageUrl]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  // Image handling
  const handleImageUpload = (file: File) => {
    handleImageUploadUtil(file, setUploadedImage);
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file?.type.match('image.*')) {
      handleImageUpload(file);
    }
  };

  // Clipboard paste handler
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

  // API communication
  const sendApiRequest = async (payload: any) => {
    try {
      const response = await fetch('/api/n8nWebhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const { responseMessages, responseImageUrl } = await processApiResponse(
        data
      );

      setImageUrl(responseImageUrl);
      setMessages(responseMessages);
    } catch (error: unknown) {
      const errorMessage = createAIMessage(
        `Error: ${
          error instanceof Error ? error.message : 'Unknown error occurred'
        }`
      );
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
      setUploadedImage(null);
    }
  };

  // Message submission handler
  const handleSubmit = async (userInput: string) => {
    if (!userInput.trim() && !uploadedImage) return;

    setUserInput('');
    setMessages([
      ...(messages || []),
      createHumanMessage(
        uploadedImage ? `${userInput} [Image attached]` : userInput
      ),
    ]);
    setIsLoading(true);

    // Extract base64 data without the data URL prefix
    let imageData = null;
    if (uploadedImage) {
      const base64Match = uploadedImage.match(
        /^data:image\/(png|jpeg|jpg|gif);base64,(.*)$/
      );
      imageData = base64Match ? base64Match[2] : null;
    }

    await sendApiRequest({
      model,
      prompt: userInput,
      image: imageData,
      webhookId:
        process.env.ENVIRONMENT === 'production'
          ? 'conversation'
          : 'conversation-teste',
      conversationId: conversationId.toString(),
    });
  };

  // Audio recording handler
  const handleAudioRecorded = async (audioBase64: string) => {
    setIsLoading(true);
    setMessages([...(messages || []), createHumanMessage('[Audio message]')]);

    await sendApiRequest({
      model,
      audioBase64,
      webhookId:
        process.env.ENVIRONMENT === 'production'
          ? 'conversation'
          : 'conversation-teste',
      conversationId: conversationId.toString(),
    });
  };

  // Key press handler
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(userInput);
    }
  };

  // Message type helper
  const isHumanMessage = (message: Message) =>
    message.id.includes('HumanMessage');

  // Conversation reset handler
  const handleClearConversation = () => {
    setMessages(null);
    setImageUrl(null);
    setUserInput('');
    setUploadedImage(null);
    setConversationId((prev) => prev + 1);
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
                if (e.target.files?.[0]) {
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
