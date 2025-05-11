# Technical Context

## Technology Stack

### Core

- Next.js 15.3.1 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Turbopack

### Libraries

- react-markdown, remark-gfm
- react-syntax-highlighter
- react-spinners
- lucide-react, react-icons
- class-variance-authority

### Integrations

- OpenAI API
- n8n webhooks

## Development Setup

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start
```

## Environment Variables

- `N8N_USERNAME`: n8n authentication
- `N8N_PASSWORD`: n8n authentication
- `ENVIRONMENT`: 'production' or 'development'

## Project Architecture

### Components

- UI Components: `src/components/ui/`
- Common Components: `src/components/common/`
- Application Components: `src/components/application/`

### API Routes

- n8nWebhook: `src/app/api/n8nWebhook/`
- OpenAI: `src/app/api/openai/`

### Data Flow

1. User inputs text in InputChat
2. Request sent to n8nWebhook API
3. API forwards to n8n with authentication
4. Response formatted and displayed (text/images)

## Responsive Design

- Mobile-first approach
- Tailwind breakpoints (sm, md, lg, xl)
- Overflow management for content
- Touch-friendly UI elements

## Technical Constraints

- Client-side rendering for interactive parts
- Environment variables for security
- Modern browser support
- Mobile-optimized components
