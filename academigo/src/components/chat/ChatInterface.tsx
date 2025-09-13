import { useState, useRef, useEffect } from "react";
import { Card } from "@heroui/card";
import { Message, ChatState } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { ThemeSwitch } from "@/components/theme-switch";
import { ChatIcon } from "@/components/icons";

// Configure your backend URL here
const BACKEND_URL = "http://localhost:8000/api/get-response";

export const ChatInterface = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: "welcome",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ],
    isLoading: false,
    error: null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatState.messages, chatState.isLoading]);

  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm sorry, I couldn't generate a response.",
        isUser: false,
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-divider bg-content1 flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2">
          <ChatIcon size={24} className="text-primary" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">AI Chat Assistant</h1>
            <p className="text-default-500 mt-1">
              Powered by Advanced AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
        </div>
      </div>

      {/* Messages Container */}
      <Card className="flex-1 mx-4 mb-0 bg-content1 border border-divider">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background max-w-6xl mx-auto">
          {chatState.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {chatState.isLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input Area */}
      <ChatInput 
        onSendMessage={sendMessage} 
        isLoading={chatState.isLoading}
      />
    </div>
  );
};
