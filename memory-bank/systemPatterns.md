# System Patterns

## Component Architecture

### Three-Tier Structure

1. **UI Components** (`src/components/ui/`)

   - Reusable UI primitives
   - Use class-variance-authority for variants
   - Leverages Radix UI primitives

2. **Common Components** (`src/components/common/`)

   - Shared utility components
   - Examples: FormatMarkdown, FadeInText

3. **Application Components** (`src/components/application/`)

   - Feature-specific components
   - Examples: InputChat (now in dedicated directory)

### Key Components

#### InputChat

- Main chat interface
- Handles user input and API requests
- Displays responses (text/images)
- Manages loading states

#### FormatMarkdown

- Renders markdown with syntax highlighting
- Uses react-markdown and remark-gfm
- Applies consistent styling
- Handles code blocks with responsive design

#### FadeInText

- Animated text display
- Uses React useEffect and useState
- Creates typing animation effect

## API Architecture

### API Routes

1. **n8nWebhook Route**

   - Handles API webhook communication
   - Authenticates requests
   - Processes responses

2. **OpenAI Routes**

   - Direct OpenAI API integration
   - Handles model communication
   - Processes responses for UI display

3. **Realtime Routes** (planned)
   - Will handle real-time communication
   - Support for streaming responses

### Request/Response Pattern

```typescript
// Request
const response = await fetch('/api/n8nWebhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ model, prompt, webhookId }),
});

// Response handling
const data = await response.json();
if (data.b64_json) {
  // Handle image
} else if (data.messages) {
  // Handle text
}
```

## State Management

- React useState for component state
- Future: Context API for global state
- Potential use of React Server Components

## Styling Approach

- Tailwind CSS v4 utility classes
- Custom color variables for theming
- Responsive design with tailwind modifiers
- Class composition with clsx and tailwind-merge
- Future dark/light mode with next-themes

## Animation Patterns

- FadeInText for text animation
- CSS transitions for UI elements
- Controlled loading states with PulseLoader
- Responsive animations for different devices
