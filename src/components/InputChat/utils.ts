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
export const processApiResponse = async (
  data: Record<string, unknown> | Array<Record<string, unknown>>
) => {
  let responseMessages: Message[] | null = null;
  let responseImageUrl: string | null = null;

  // Handle different response formats
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0] as Record<string, unknown>;
    responseImageUrl = (firstItem.image as string) || null;
    responseMessages = (firstItem.messages as Message[]) || null;
  } else {
    responseImageUrl =
      ((data as Record<string, unknown>).image as string) || null;
    responseMessages =
      ((data as Record<string, unknown>).messages as Message[]) || null;
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
      .filter(({ msg }) => !msg.id.includes('HumanMessage'));

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
  // Max size in bytes (1MB)
  const MAX_SIZE = 1024 * 1024;

  // If file is already small enough, use the simpler approach
  if (file.size <= MAX_SIZE) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    return;
  }

  // Otherwise, compress the image
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas for image compression
      const canvas = document.createElement('canvas');

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      const maxDimension = 1200;

      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas at new dimensions
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      // Get compressed image as data URL (JPEG with quality 0.8)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);

      // Set the compressed image
      setUploadedImage(compressedDataUrl);
    };

    if (event.target?.result) {
      img.src = event.target.result as string;
    }
  };

  reader.readAsDataURL(file);
};
