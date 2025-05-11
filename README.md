# Agent UI

Agent UI is an open-source web application providing a simple interface for connecting with AI models and automation tools via webhooks. It supports text and image generation with plans for MCP connections.

## Core Features

- **Chat Interface:** Clean, modern UI for AI interactions
- **Webhook Connectivity:** Connects to AI models and automation tools (like n8n)
- **Text/Image Generation:** Supports AI-powered text and image responses
- **Responsive Design:** Optimized for all device sizes

## Technology Stack

- Next.js 15.3.1 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Getting Started

1. **Clone and install:**

   ```bash
   git clone <repository-url>
   cd agent-ui
   npm install
   ```

2. **Set up environment:**
   Create `.env.local` with:

   ```env
   N8N_USERNAME=your_username
   N8N_PASSWORD=your_password
   ENVIRONMENT=development
   ```

3. **Run development server:**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`

4. **Production build:**
   ```bash
   npm run build
   npm run start
   ```

## Project Structure

```
agent-ui/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   ├── components/         # React components
│   │   ├── application/    # App-specific components
│   │   ├── common/         # Reusable components
│   │   └── ui/             # UI primitives
│   └── lib/                # Utilities and helpers
```

## Future Goals

- Enhanced AI model support
- MCP connection support
- Conversation history
- User accounts
- Advanced UI features
- Global connectivity
