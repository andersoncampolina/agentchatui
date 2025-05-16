import { Message } from './types';

// Message creation utilities
export const createHumanMessage = (content: string): Message => ({
  lc: 1,
  type: 'constructor',
  id: ['langchain_core', 'messages', 'HumanMessage'],
  kwargs: {
    content,
    additional_kwargs: {},
    response_metadata: {},
  },
});

export const createAIMessage = (
  content: string,
  imageUrl?: string
): Message => ({
  lc: 1,
  type: 'constructor',
  id: ['langchain_core', 'messages', 'AIMessage'],
  kwargs: {
    content,
    additional_kwargs: {},
    response_metadata: imageUrl ? { image_url: imageUrl } : {},
  },
});

// API response processing
export const processApiResponse = async (data: any) => {
  let responseMessages = null;
  let responseImageUrl = null;

  // Handle different response formats
  if (Array.isArray(data) && data.length > 0) {
    responseImageUrl = data[0]?.image || null;
    responseMessages = data[0]?.messages || null;
  } else {
    responseImageUrl = data.image || null;
    responseMessages = data.messages || null;
  }

  // Create default messages if none provided
  if (!responseMessages && responseImageUrl) {
    responseMessages = [
      createAIMessage('Here is the image you requested:', responseImageUrl),
    ];
  } else if (!responseMessages) {
    responseMessages = [
      createAIMessage(
        'Received response but no messages were found in the data.'
      ),
    ];
  }

  // Associate image with the last AI message if needed
  if (responseImageUrl && responseMessages) {
    const aiMessages = responseMessages
      .map((msg: Message, idx: number) => ({ msg, idx }))
      .filter(({ msg }: { msg: Message }) => !msg.id.includes('HumanMessage'));

    if (aiMessages.length > 0) {
      const lastAiMessageIndex = aiMessages.pop()?.idx;
      if (lastAiMessageIndex !== undefined) {
        responseMessages[lastAiMessageIndex] = {
          ...responseMessages[lastAiMessageIndex],
          kwargs: {
            ...responseMessages[lastAiMessageIndex].kwargs,
            response_metadata: {
              ...responseMessages[lastAiMessageIndex].kwargs.response_metadata,
              image_url: responseImageUrl,
            },
          },
        };
      }
    }
  }

  return { responseMessages, responseImageUrl };
};

// File handling utilities
export const handleImageUpload = (
  file: File,
  setUploadedImage: (image: string) => void
) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    setUploadedImage(reader.result as string);
  };
  reader.readAsDataURL(file);
};
