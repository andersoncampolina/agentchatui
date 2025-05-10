# System Patterns

## Component Architecture

### Three-Tier Component Structure

The project follows a three-tier component structure:

1. **UI Components** (`src/components/ui/`)

   - Reusable, presentational components
   - Examples: Button, Textarea
   - Implement design system fundamentals
   - Use class-variance-authority for variant management

2. **Common Components** (`src/components/common/`)

   - Shared utility components used across features
   - Examples: FormatMarkdown, FadeInText
   - Provide specific functionality not tied to application features
   - Can compose UI components together

3. **Application Components** (`src/components/application/`)
   - Feature-specific components
   - Examples: InputChat
   - Implement business logic and state management
   - Use UI and Common components as building blocks

### Component Patterns

#### InputChat Component

- Main chat interface component
- Handles user input and submission
- Manages loading states
- Displays AI responses (text and images)
- Example:

```tsx
// InputChat.tsx pattern
'use client';
import { useState } from 'react';
// Import UI components
// Handle user input via form controls
// Send requests to API
// Display responses with proper formatting
```

#### FormatMarkdown Component

- Renders markdown content with syntax highlighting
- Uses react-markdown and react-syntax-highlighter
- Applies consistent styling to different markdown elements
- Example:

```tsx
// FormatMarkdown.tsx pattern
'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SyntaxHighlighter } from 'react-syntax-highlighter';
// Configure components for different markdown elements
// Apply consistent styling
```

#### Animation Components

- Components like FadeInText for smooth UI animations
- Use React useEffect and useState for controlling animations
- Apply CSS transitions and transforms
- Example:

```tsx
// FadeInText.tsx pattern
'use client';
import { useEffect, useState } from 'react';
// Track visible characters
// Use timeouts to reveal text gradually
// Apply CSS transitions for smooth effects
```

## API Architecture

### API Routes

The application uses Next.js API routes for backend functionality:

1. **n8nWebhook Route** (`src/app/api/n8nWebhook/route.ts`)

   - Handles POST requests to n8n webhook
   - Authenticates with basic auth
   - Transforms request data before forwarding
   - Processes and returns responses to the client

2. **OpenAI Routes** (`src/app/api/openai/`)
   - Direct integration with OpenAI services
   - Manages sessions and responses
   - In progress/development

### Request/Response Patterns

#### Webhook Request Pattern

```typescript
// Standard webhook request pattern
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
```

#### Response Handling Pattern

```typescript
// Response handling pattern
const data = await response.json();
if (data.b64_json) {
  // Handle image data
  setImage(data.b64_json);
} else if (data.messages) {
  // Handle text messages
  setMessages(data.messages);
} else {
  // Handle fallback/error case
}
```

## State Management

### Component State

- Using React's useState hooks for local component state
- Example:

```typescript
const [userInput, setUserInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [messages, setMessages] = useState<Message[] | null>(null);
const [image, setImage] = useState<any | null>(null);
```

### Future Considerations

- May implement Context API for global state as the application grows
- Consider state management libraries if complexity increases
- Implement persistent storage for conversation history

## Error Handling

### API Error Pattern

```typescript
try {
  // API request
} catch (error: any) {
  console.error('Failed to send message:', error);
  // Format error as response message
  const errorMessage = {
    content: `Error: ${error.message || 'Unknown error occurred'}`,
    // Additional fields as needed
  };
  // Update UI with error
}
```

### Loading State Pattern

```typescript
// Set loading state before API call
setIsLoading(true);
try {
  // API request
} finally {
  // Reset loading state after API call (success or error)
  setIsLoading(false);
}
```

## Styling Approach

### Tailwind CSS

- Utility-first CSS using Tailwind
- Component-specific styling
- Custom color variables for theming
- Example:

```tsx
<div className="p-4 rounded-lg border-[1px] border-[var(--quaternary-color)]">
  {/* Component content */}
</div>
```

### Component Variants

- Using class-variance-authority for component variants
- Consistent styling across components
- Example:

```typescript
// Button variants
const buttonVariants = cva('rounded-md font-medium transition-colors...', {
  variants: {
    variant: {
      default: 'bg-primary text-white...',
      secondary: 'bg-secondary text-primary...',
      // Other variants
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-5 py-2.5 text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});
```

## File Naming Conventions

- React components: PascalCase (`InputChat.tsx`, `FormatMarkdown.tsx`)
- API routes: kebab-case (`n8n-webhook/route.ts`)
- Utility functions: camelCase (`utils.ts`)
- Component props interfaces: ComponentNameProps (`InputChatProps`)
- Type definitions: PascalCase (`Message`, `ResponseData`)

These patterns form the architectural foundation of the Agent UI project and should be followed for all new implementations to maintain consistency and readability.
