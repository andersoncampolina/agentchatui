# Agent UI

A modern, open-source Next.js web application that provides a simple interface to connect with AI models and automation tools via webhooks and direct API integration.

See a online version here: https://agentchatui.com

<img src="/public/assets/images/agent-ui-example.jpeg" alt="Agent UI Screenshot" width="600"/>

## Features

- 🤖 Clean, intuitive interface for AI interactions
- 📱 Mobile-responsive design for all devices
- 🎨 Modern UI with animations and loading states
- 🔌 Webhook integration with n8n automation platform
- 🧠 Direct OpenAI API integration
- 🖼️ Text and image generation support
- 📝 Markdown formatting with syntax highlighting
- ⚡ Built with Next.js 15.3.1 and React 19
- 🎯 Tailwind CSS 4 for modern styling
- 🚀 Turbopack for faster development

## Technology Stack

- **Framework**: Next.js 15.3.1 with App Router
- **Frontend**: React 19, TypeScript 5
- **Styling**: Tailwind CSS 4
- **Build Tool**: Turbopack
- **UI Components**: Radix UI primitives
- **Animations**: React transitions and custom animations
- **Markdown**: react-markdown with syntax highlighting

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For cloning the repository

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/agent-ui.git
cd agent-ui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# n8n Authentication (required for webhook integration)
N8N_USERNAME=your_n8n_username
N8N_PASSWORD=your_n8n_password

# Environment Setting
ENVIRONMENT=development

# OpenAI API Key (required for direct OpenAI integration)
OPENAI_API_KEY=your_openai_api_key
```

#### How to Get Required API Keys:

**n8n Setup:**

1. Set up an n8n instance or use n8n Cloud
2. Create authentication credentials
3. Set up webhook endpoints in your n8n workflows

**OpenAI API Key:**

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

### 4. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3020`

### 5. Production Build

To build for production:

```bash
npm run build
npm start
```

## Usage

### Basic Chat Interface

1. Open the application in your browser
2. Type your message in the input field
3. Press Enter or click the send button
4. The AI will process your request and display the response

### Webhook Integration

The application can connect to n8n workflows through webhooks:

1. Set up your n8n workflow with a webhook trigger
2. Configure the webhook URL in your n8n instance
3. The application will automatically send requests to your configured webhook

### Image Generation

The application supports image generation:

1. Send a prompt for image generation
2. The AI will process the request
3. Generated images will be displayed in the chat interface

## Project Structure

```
agent-ui/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── n8nWebhook/          # n8n webhook API route
│   │   │   └── openai/              # OpenAI API routes
│   │   ├── layout.tsx               # App layout
│   │   └── page.tsx                 # Main page
│   ├── components/
│   │   ├── InputChat/               # Main chat interface
│   │   ├── common/                  # Shared components
│   │   └── ui/                      # UI primitives
│   └── lib/
│       └── utils.ts                 # Utility functions
├── memory-bank/                     # Project documentation
├── package.json
└── README.md
```

## Configuration

### Environment Variables

| Variable         | Description                           | Required |
| ---------------- | ------------------------------------- | -------- |
| `N8N_USERNAME`   | n8n authentication username           | Yes      |
| `N8N_PASSWORD`   | n8n authentication password           | Yes      |
| `ENVIRONMENT`    | Set to 'production' or 'development'  | Yes      |
| `OPENAI_API_KEY` | OpenAI API key for direct integration | Yes      |

### Webhook Configuration

The application supports two webhook environments:

- **Development**: `https://n8n.renthub.com.br/webhook-test/{webhookId}`
- **Production**: `https://n8n.renthub.com.br/webhook/{webhookId}`

## Available Scripts

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build the application for production
- `npm start`: Start the production server
- `npm run lint`: Run ESLint for code quality

## Features in Detail

### Chat Interface

- Clean, modern design with animations
- Loading states with visual feedback
- Support for both text and image responses
- Mobile-optimized layout

### Markdown Support

- Syntax highlighting for code blocks
- Responsive table handling
- Proper formatting for various content types

### Responsive Design

- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface elements

## Customization

### Styling

The application uses Tailwind CSS 4 for styling. You can customize:

- Colors and themes in `tailwind.config.ts`
- Component styles in individual component files
- Global styles in `src/app/globals.css`

### API Integration

To add new AI services:

1. Create a new API route in `src/app/api/`
2. Add the integration logic
3. Update the frontend to handle the new service

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## Troubleshooting

### Common Issues

**Port Already in Use:**

```bash
# Change port in package.json or kill the process
lsof -ti:3020 | xargs kill
```

**Environment Variables Not Loading:**

- Ensure `.env.local` is in the root directory
- Restart the development server after changes

**API Authentication Errors:**

- Verify your API keys are correct
- Check that environment variables are properly set

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure your API keys have proper permissions
4. Check the network tab for failed API requests

## Roadmap

Planned features:

- [ ] Audio message sending capability
- [ ] Conversation history and context management
- [ ] Dark/light theme support
- [ ] Multi-model support
- [ ] Real-time streaming responses
- [ ] User authentication
- [ ] Enhanced error handling
- [ ] Performance optimizations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support:

- Create an issue on GitHub
- Check the documentation in the `memory-bank/` folder
- Review the code comments for implementation details

---

Built with ❤️ by Anderson Campolina
