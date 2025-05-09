# Agent UI

Agent UI is an open-source web application designed to provide a simple yet powerful interface for connecting with a variety of AI models and agent/automation tools. It supports integrations via webhooks (e.g., with n8n) and aims to offer an intuitive, easy-to-understand chat experience similar to platforms like OpenAI and Anthropic. The project also plans to support MCP (Multi-Capability Platform/Protocol) connections in the near future.

## Core Features

- **Intuitive Chat Interface:** A clean, modern UI for seamless interaction with AI services.
- **Broad Connectivity:** Connects to various AI models, agent/automation tools (like n8n), and other services via webhooks.
- **Text-to-Image Generation:** Supports AI-powered image generation (e.g., using models like GPT-Image-1).
- **Responsive Design:** Optimized for a consistent user experience across different devices.
- **Real-time Feedback:** Provides loading states and aims for immediate feedback during operations.
- **Open Source:** Freely available for use, modification, and contribution.

## Technology Stack

- **Framework:** Next.js (v15.3.1 with App Router)
- **UI Library:** React (v19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React, React Icons
- **UI Primitives:** Radix UI (for accessible components)
- **Development Tools:** ESLint 9, Turbopack

## Getting Started

To get the project running locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd agent-ui
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add any necessary environment variables (e.g., for n8n integration):

    ```env
    N8N_USERNAME=your_n8n_username
    N8N_PASSWORD=your_n8n_password
    ENVIRONMENT=development # or production
    # Add other variables as needed
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```

    The application should now be running on `http://localhost:3000`.

5.  **Production Build:**
    ```bash
    npm run build
    npm run start
    ```

## Project Structure

The project follows a standard Next.js App Router structure:

```
agent-ui/
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, API routes)
│   │   ├── api/            # Backend API route handlers
│   │   ├── realtime/       # Real-time features (e.g., WebSockets)
│   │   ├── page.tsx        # Main application page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── application/    # Application-specific components (e.g., InputChat)
│   │   ├── common/         # Reusable common components (e.g., FadeInText)
│   │   └── ui/             # Base UI primitives (e.g., Button, Textarea)
│   └── lib/                # Shared utilities, helpers, and hooks
├── public/                 # Static assets
├── .env.local              # Local environment variables (gitignored)
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## Goals & Future Direction

- **Enhanced AI Model Support:** Integrate with a wider range of AI models and capabilities.
- **MCP Connection:** Implement support for Multi-Capability Platform/Protocol connections.
- **Conversation History:** Allow users to view and manage their past interactions.
- **User Accounts:** Introduce user authentication for personalized experiences and saved preferences.
- **Advanced UI/UX:** Continuously improve the user interface with features like dark/light mode, enhanced visualizations, and smoother animations.
- **Global Connectivity:** Strive for seamless integration with any agent or automation tool.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request. (Further details on contributing guidelines can be added here).

## License

This project is open source. (A specific license like MIT can be added here if decided).
