# Student AI Assistant

A modern, clean chat interface for a Student AI Assistant platform. This project provides the front-end implementation for a chat-based assistant designed to help students.

## Features

- Clean, modern UI optimized for readability
- Responsive chat interface
- Message input with send button
- Simulated AI responses (placeholder for backend integration)
- Dark mode support

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/studentllm.git
cd studentllm
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - React components for the chat interface
  - `ChatInterface.tsx` - Main chat interface component
  - `ChatMessage.tsx` - Individual message component
  - `Header.tsx` - Application header

## Customization

- The UI uses Tailwind CSS for styling and can be easily customized by modifying the component classes
- The simulated AI response in `ChatInterface.tsx` can be replaced with actual backend integration

## Next Steps

1. Implement backend integration
2. Add authentication
3. Implement message history persistence
4. Add more advanced chat features (typing indicators, message status, etc.)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS
