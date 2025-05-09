# Technical Context

## Technology Stack

### Frontend

- **Next.js 15.3.1**: Core framework for the React application with App Router
- **React 19**: Latest version of React with improved performance
- **TypeScript**: For type safety and improved developer experience
- **Tailwind CSS 4**: Utility-first CSS framework for styling
- **Radix UI**: Headless UI components for accessible design elements

### Development Tools

- **ESLint 9**: JavaScript/TypeScript linting
- **Turbopack**: For faster development experience
- **Node.js**: JavaScript runtime environment

## Development Environment

To run the application locally:

```
npm run dev
```

This starts the Next.js development server with Turbopack enabled.

For production builds:

```
npm run build
npm run start
```

## Technical Constraints

- Browser compatibility requirements focus on modern browsers
- Performance optimization for interactive elements
- Real-time capabilities with minimal latency
- Image handling and display capabilities

## Dependencies

### Core Dependencies

- **next**: Next.js framework
- **react / react-dom**: React library
- **lucide-react**: Icon library
- **react-icons**: Additional icon options
- **clsx / class-variance-authority / tailwind-merge**: Utilities for managing CSS classes
- **@radix-ui/react-slot**: Composition utilities for React components

### Development Dependencies

- **typescript**: TypeScript support
- **eslint**: Code linting
- **tailwindcss**: CSS framework
- **@types/react**, **@types/node**, etc.: TypeScript type definitions

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
