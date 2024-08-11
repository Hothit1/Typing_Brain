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
│   │   ├── MainChat.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── ChatHistoryItem.tsx
│   ├── CreateGPTModal.tsx
│   ├── EditGPTModal.tsx
│   ├── GPTItem.tsx
│   ├── ModelSelector.tsx
│   └── UI
│       ├── Button.tsx
│       └── Input.tsx
├── pages
│   └── api
│       ├── generateResponse.ts
│       └── generateTitle.ts
└── utils
    └── openai.ts
```

### Component Descriptions

- `app/`: Contains the main application files for Next.js 13+ App Router.
  - `layout.tsx`: Defines the main layout structure for the application.
  - `page.tsx`: The main page component that renders the chat interface.

- `components/`: Contains reusable React components.
  - `Layout/`: Components for the main application layout.
    - `MainChat.tsx`: The core chat interface component, handling message display and input.
    - `Sidebar.tsx`: Renders the sidebar with model selection, GPTs, and chat history.
    - `TopBar.tsx`: Contains model selection and addon options.
  - `ChatHistoryItem.tsx`: Represents a single chat history item.
  - `CreateGPTModal.tsx`: Modal for creating new GPTs.
  - `EditGPTModal.tsx`: Modal for editing existing GPTs.
  - `GPTItem.tsx`: Represents a single GPT item in the sidebar.
  - `ModelSelector.tsx`: Dropdown component for selecting different AI models.
  - `UI/`: Basic UI components.
    - `Button.tsx`: Reusable button component.
    - `Input.tsx`: Reusable input component.

- `pages/`: Contains API routes for Next.js.
  - `api/generateResponse.ts`: Handles API requests to generate responses from AI models.
  - `api/generateTitle.ts`: Generates titles for chat sessions.

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
- [x] Implement basic local storage for chat history
- [x] Create functionality to switch between chats

#### GPT Management
- [x] Implement creation of custom GPTs
- [x] Add functionality to edit and delete GPTs
- [x] Store GPTs in local storage

#### Responsive Design and Polish (2 hours)
- [x] Ensure layout works on desktop and mobile
- [x] Add final styling touches and icons

### Additional Implemented Features
- [x] Implement collapsible sidebar
- [x] Add DALL-E image generation support
- [x] Implement auto-save and auto-title generation for chats
- [x] Add support for multiple AI models (OpenAI, Anthropic, Groq)

### Final Steps
- [x] Review and test all features
- [x] Update README.md with project description and setup instructions
- [ ] Final commit and push to GitHub

Improment idea: 

- Make chat interface look more like claude.
- add google ai
- add duckduckgo search 
- add markdown to display code.
- add tts addon
- add vision addon
- add attach file like srt, pdf to handle 
- add wishper
- add artifacts like claude

## Interface Ideas

- Frontend Framework: Using Next.js
- Implemented a flexible layout with collapsible sidebar
- Created reusable components for chat bubbles, model selectors, and GPT items
- Using Tailwind CSS for consistent styling
- State Management: Implemented using React hooks and context
- API Integration: Implemented for OpenAI, Anthropic, and Groq models
- Local Storage: Implemented for chat history and GPTs
- Responsive Design: Implemented, works on desktop and mobile
- Customization: Implemented custom GPTs with editable system messages