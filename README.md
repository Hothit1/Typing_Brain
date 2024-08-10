# Typing Brain

Typing Brain is an AI-powered chat interface that allows users to interact with various language models. This project is built using Next.js, TypeScript, and Tailwind CSS.

## Project Structure

```
src
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── Layout
│   │   ├── InfoPanel.tsx
│   │   ├── MainChat.tsx
│   │   └── Sidebar.tsx
│   ├── ModelSelector.tsx
│   └── UI
│       ├── Button.tsx
│       └── Input.tsx
├── pages
│   └── api
│       └── generateResponse.ts
└── utils
    └── openai.ts
```

### Component Descriptions

- `app/`: Contains the main application files for Next.js 13+ App Router.
  - `layout.tsx`: Defines the main layout structure for the application.
  - `page.tsx`: The main page component that renders the chat interface.

- `components/`: Contains reusable React components.
  - `Layout/`: Components for the main application layout.
    - `InfoPanel.tsx`: Renders information about the selected AI model or chat session.
    - `MainChat.tsx`: The core chat interface component, handling message display and input.
    - `Sidebar.tsx`: Renders the sidebar with model selection and chat history.
  - `ModelSelector.tsx`: Dropdown component for selecting different AI models.
  - `UI/`: Basic UI components.
    - `Button.tsx`: Reusable button component.
    - `Input.tsx`: Reusable input component.

- `pages/`: Contains API routes for Next.js.
  - `api/generateResponse.ts`: Handles API requests to generate responses from AI models.

- `utils/`: Utility functions and helpers.
  - `openai.ts`: Contains utility functions for interacting with the OpenAI API.

## Project Roadmap and Checklist

### Project Setup
- [x] Initialize Next.js project with TypeScript and Tailwind CSS
- [x] Set up GitHub repository
- [x] Configure src/ directory and App Router
- [x] Set up import alias (@/*)
- [x] Create initial README.md with project roadmap
- [x] Create initial project structure (components, utils, etc.)

### GitHub Management
- [x] Make initial commit and push to GitHub
- [x] Create and push README.md
- [x] Create feature branches for each major component
- [x] Make regular commits with clear messages
- [x] Create pull requests for completed features
- [x] Merge completed features into main branch

### Day 1: Core Setup and Chat Interface
#### Basic Layout (2 hours)
- [x] Implement simplified three-column layout
- [x] Create placeholder components for each section

#### Chat Interface (4 hours)
- [x] Develop main chat component with message display
- [x] Implement message input functionality
- [x] Add basic styling with Tailwind CSS

#### AI Model Integration (3 hours)
- [x] Set up API route to handle requests to OpenAI
- [x] Implement basic error handling

#### Model Selection (2 hours)
- [x] Create dropdown for model selection
- [x] Implement logic to switch between models

### Day 2: Essential Features and Polish
#### Chat History (3 hours)
- [ ] Implement basic local storage for chat history
- [ ] Create functionality to switch between chats

#### API Key Management (3 hours)
- [ ] Create form for users to input their API key
- [ ] Store API key securely (consider using encryption)

#### Responsive Design and Polish (2 hours)
- [ ] Ensure layout works on desktop and mobile
- [ ] Add final styling touches and icons

### Additional Tasks (if time allows)
- [ ] Implement dark mode toggle
- [ ] Add basic error handling for API failures
- [ ] Create a simple landing page explaining the app

### Final Steps
- [ ] Review and test all features
- [ ] Update README.md with project description and setup instructions
- [ ] Final commit and push to GitHub

## Interface Ideas

- Frontend Framework: Using Next.js
- Implemented a flexible grid system for the three-column layout
- Created reusable components for chat bubbles, model selectors, and agent cards
- Using Tailwind CSS for consistent styling
- State Management: To be implemented (consider using Redux or React Context)
- API Integration: Implemented for OpenAI and Anthropic models
- Authentication: To be implemented
- Responsive Design: Partially implemented, needs refinement
- Local Storage: To be implemented
- Markdown Support: To be implemented
- Customization: To be implemented
- Accessibility: To be implemented