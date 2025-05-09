# System Patterns

## Architecture Overview

Agent UI follows a modern Next.js architecture with the App Router pattern. The application is structured as follows:

```
src/
├── app/                    # Next.js App Router structure
│   ├── api/                # API routes for backend functionality
│   ├── realtime/           # Real-time features and endpoints
│   ├── page.tsx            # Main landing page
│   ├── layout.tsx          # Root layout component
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── application/        # Application-specific components
│   ├── common/             # Shared utility components
│   └── ui/                 # UI primitives and design system
└── lib/                    # Shared utilities and helpers
```

## Design Patterns

### Component Organization

- **UI Components**: Base-level UI primitives following a design system approach, located in `src/components/ui/`.
- **Common Components**: Reusable components that can be used across features, located in `src/components/common/`.
- **Application Components**: Feature-specific components tied to business logic, located in `src/components/application/`.
- New components should follow the existing pattern of their category.

### State Management

- Local React state using `useState` for component-level state
- React's Context API may be used for more complex state sharing
- Server components for fetching and managing server-side data

### API Communication

- API routes in the `/api` directory handle server-side logic
- Fetch API is used for client-side requests
- Webhook pattern for integration with external AI services

### UI/UX Patterns

- Loading states to provide feedback during async operations
- Animated transitions for a polished feel (using FadeInText component)
- Responsive design for multiple device types
- Clean, minimal aesthetics with a focus on content

## Technical Decisions

### Framework Choice

- **Next.js**: Chosen for its performance, SEO benefits, and server-side rendering capabilities
- **React 19**: Using the latest React version for improved performance and features
- **TypeScript**: For type safety and improved developer experience

### Styling Approach

- **Tailwind CSS**: Used for utility-first CSS styling. Prefer utility classes over custom CSS.
- **Component-based styling**: Each component manages its own styles.
- **class-variance-authority (CVA)**: Used for creating component variants with consistent styling.
- **Global styles**: Minimal global styles defined in `globals.css`.
- Follow existing class naming patterns for consistency.

### API Integration

- **Webhook Pattern**: External services communicate via webhooks
- **JSON Data Format**: Standard format for data exchange
- **Error Handling**: Comprehensive error handling for API requests

## Component Relationships

- Main page renders the InputChat component as the primary interaction point
- InputChat component manages state and API communication
- UI components (Button, Textarea) provide the interactive elements
- Common components (FadeInText) provide enhanced visual feedback

## Code Conventions

- **TypeScript**: For type safety and improved developer experience. React components use `.tsx`.
- **React Functional Components**: Utilize functional components with React Hooks.
- **'use client' Directive**: Use for client-side components as per Next.js App Router conventions.
- **Error Handling**: Follow existing error handling patterns for consistency.
- **Asynchronous Operations**: Use `async/await` for promises.
- **JSON Formatting**: Maintain consistent JSON formatting for API requests.
