# System Patterns

## Component Architecture

### Three-Tier Structure

1. **UI Components** (`src/components/ui/`)

   - Reusable UI primitives
   - Use class-variance-authority for variants

2. **Common Components** (`src/components/common/`)

   - Shared utility components
   - Examples: FormatMarkdown, FadeInText

3. **Application Components** (`src/components/application/`)
   - Feature-specific components
   - Examples: InputChat

### Key Components

#### InputChat

- Main chat interface
- Handles user input and API requests
- Displays responses (text/images)

#### FormatMarkdown

- Renders markdown with syntax highlighting
- Uses react-markdown
- Applies consistent styling

#### FadeInText

- Animated text display
- Uses React useEffect and useState

## API Architecture

### API Routes

1. **n8nWebhook Route**

   - Handles API webhook communication
   - Authenticates requests
   - Processes responses

2. **OpenAI Routes** (in progress)
   - Direct OpenAI integration

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

## Styling Approach

- Tailwind CSS utility classes
- Custom color variables for theming
- Responsive design with tailwind modifiers
