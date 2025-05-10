# Technical Context

## Technology Stack

### Frontend

- **Framework**: Next.js 15.3.1 (with App Router)
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Build System**: Turbopack with dev mode (`--turbopack` flag)

### External Libraries

- **Icons**: react-icons, lucide-react
- **Markdown**: react-markdown, remark-gfm
- **Code Highlighting**: react-syntax-highlighter
- **Loading Indicators**: react-spinners
- **UI Components**: Custom components with class-variance-authority, clsx, tailwind-merge

### APIs and Services

- **AI Provider**: OpenAI (via OpenAI SDK)
- **Workflow Automation**: n8n (via webhooks)
- **API Communication**: Native fetch API with POST requests

## Development Setup

### Environment Variables

- `N8N_USERNAME`: Username for n8n authentication
- `N8N_PASSWORD`: Password for n8n authentication
- `ENVIRONMENT`: Environment indicator ('production' or other)

### Local Development

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Architecture

### Component Architecture

The project follows a three-tier component architecture:

1. **UI Components** (`src/components/ui/`): Low-level reusable UI elements (buttons, textareas, etc.)
2. **Common Components** (`src/components/common/`): Shared utility components (FormatMarkdown, FadeInText, etc.)
3. **Application Components** (`src/components/application/`): Feature-specific components (InputChat, etc.)

### API Routes

- **n8nWebhook** (`src/app/api/n8nWebhook/`): Handles communication with n8n workflows
- **OpenAI** (`src/app/api/openai/`): Integration with OpenAI services (in progress)

### Data Flow

1. User inputs text in the InputChat component
2. Input is sent to the n8nWebhook API route
3. The API route forwards the request to n8n with proper authentication
4. n8n processes the request and returns the response
5. Response is formatted and displayed in the UI (text with markdown or images)

## Technical Constraints

### Performance

- Client-side rendering for interactive components
- Server components for static parts where possible
- Efficient image loading and display

### Security

- Environment variables for sensitive information
- Basic authentication for external API calls
- No client-side exposure of API keys

### Compatibility

- Modern browser support
- Responsive design for various screen sizes
- Progressive enhancement where possible

## Dependencies

### Core Dependencies

```json
"dependencies": {
  "@radix-ui/react-slot": "^1.2.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.507.0",
  "next": "15.3.1",
  "openai": "^4.98.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-icons": "^5.5.0",
  "react-markdown": "^10.1.0",
  "react-spinners": "^0.17.0",
  "react-syntax-highlighter": "^15.6.1",
  "remark-gfm": "^4.0.1",
  "tailwind-merge": "^3.2.0"
}
```

### Dev Dependencies

```json
"devDependencies": {
  "@eslint/eslintrc": "^3",
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@types/react-syntax-highlighter": "^15.5.13",
  "eslint": "^9",
  "eslint-config-next": "15.3.1",
  "tailwindcss": "^4",
  "tw-animate-css": "^1.2.9",
  "typescript": "^5"
}
```

## API Integration

### External Services

- Integration with AI services via API webhooks
- Current focus on image generation capabilities (gpt-image-1)
- JSON-based communication format

### Webhook Structure

The application sends requests to `/api/n8nWebhook` with the following structure:

```json
{
  "model": "gpt-image-1",
  "prompt": "User input text",
  "webhookId": "responses"
}
```

## Deployment

The application is designed to be deployed on Vercel or similar platforms that support Next.js applications.

Deployment requirements:

- Node.js runtime environment
- Environment variables for API keys and configurations
- Network access for external API communications

## Technical Roadmap

- Implement WebSocket connections for real-time updates
- Add support for additional AI models and capabilities
- Enhance error handling and recovery mechanisms
- Implement performance monitoring and analytics
