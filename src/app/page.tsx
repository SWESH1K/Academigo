// Use direct import for client component
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
