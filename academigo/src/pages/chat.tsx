"use client";

import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Avatar } from "@heroui/avatar";
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import ReactMarkdown from 'react-markdown';
import { 
  saveMessagesToStorage, 
  loadMessagesFromStorage, 
  clearMessagesFromStorage,
  exportMessagesToFile,
  getChatHistoryMetadata,
  importMessagesFromFile,
  forceSaveToStorage,
  cleanupAutoSave
} from "@/lib/messageStorage";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load messages from storage on component mount
  useEffect(() => {
    const savedMessages = loadMessagesFromStorage();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      // Default welcome message if no saved messages
      const welcomeMessage: Message = {
        role: "assistant",
        content: "Hello! How can I help you today?",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to storage whenever messages change (automatic)
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages]);

  // Cleanup auto-save when component unmounts
  useEffect(() => {
    return () => {
      cleanupAutoSave();
    };
  }, []);

  // Auto-save before page unload to prevent data loss
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messages.length > 0) {
        forceSaveToStorage(messages);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message with timestamp
    const userMessageObj: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/get-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant response with timestamp
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "Sorry, I couldn't generate a response.",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const welcomeMessage: Message = {
      role: "assistant",
      content: "Hello! How can I help you today?",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
    clearMessagesFromStorage();
  };

  const handleExportChat = () => {
    exportMessagesToFile();
  };

  const handleImportChat = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedMessages = await importMessagesFromFile(file);
      setMessages(importedMessages);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to import messages:', error);
      alert('Failed to import chat history. Please check the file format.');
    }
  };

  const chatMetadata = getChatHistoryMetadata();

  return (
    <div className="h-screen flex flex-col">
      <div className="w-full px-2">
        <Navbar />
      </div>
      <div className="flex flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 dark:border-gray-700 bg-black/90 dark:bg-black/95 backdrop-blur-sm p-4 flex flex-col">
          <Button
            color="primary"
            radius="lg"
            className="mb-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-300 text-white"
            onClick={handleNewChat}
          >
            ✨ New Chat
          </Button>
          <div className="flex gap-2 mb-4">
            <Button
              color="secondary"
              radius="lg"
              size="sm"
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg transition-all duration-300 text-white"
              onClick={handleExportChat}
            >
              📥 Export
            </Button>
            <Button
              color="warning"
              radius="lg"
              size="sm"
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg transition-all duration-300 text-white"
              onClick={handleImportChat}
            >
              📤 Import
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-gray-300 dark:text-gray-400 mb-2">
              Recent Conversations
              {chatMetadata.messageCount > 0 && (
                <span className="ml-2 text-gray-500">
                  ({chatMetadata.messageCount} messages)
                </span>
              )}
            </h3>
          </div>
          <ScrollShadow className="flex-1 space-y-2">
            <Card className="p-3 text-xs cursor-pointer bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-700/50 dark:border-gray-600/50 hover:bg-gray-800 dark:hover:bg-gray-700/80 transition-all duration-200 hover:shadow-md">
              <div className="font-medium text-gray-100 dark:text-gray-200">AI Development Chat</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</div>
            </Card>
            <Card className="p-3 text-xs cursor-pointer bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-700/50 dark:border-gray-600/50 hover:bg-gray-800 dark:hover:bg-gray-700/80 transition-all duration-200 hover:shadow-md">
              <div className="font-medium text-gray-100 dark:text-gray-200">React Components</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday</div>
            </Card>
          </ScrollShadow>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <ScrollShadow className="flex-1 p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <Avatar
                      src="data:image/jpeg;base64,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"
                      size="sm"
                      className="ring-2 ring-gray-700 dark:ring-gray-600"
                    />
                  </div>
                )}
                <div
                  className={`rounded-xl px-4 py-3 max-w-xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                    ? "bg-gradient-to-r from-gray-800 to-black text-white shadow-gray-800/30 dark:shadow-black/50"
                    : "bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200 border border-gray-700 dark:border-gray-600"
                    }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          code: ({ children }) => <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">{children}</code>,
                          pre: ({ children }) => <pre className="bg-gray-800 p-2 rounded mt-2 overflow-x-auto text-xs">{children}</pre>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-600 pl-2 italic">{children}</blockquote>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex-shrink-0">
                    <Avatar
                      src="data:image/png;base64,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"
                      size="sm"
                      className="ring-2 ring-gray-600 dark:ring-gray-500"
                    />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="flex-shrink-0">
                  <Avatar
                    src="data:image/jpeg;base64,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"
                    size="sm"
                    className="ring-2 ring-gray-700 dark:ring-gray-600"
                  />
                </div>
                <div className="rounded-xl px-4 py-3 max-w-xl text-sm leading-relaxed shadow-sm bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200 border border-gray-700 dark:border-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </ScrollShadow>

          {/* Input Bar */}
          <div className="border-t border-gray-800 dark:border-gray-700 p-4 bg-black/80 dark:bg-black/90 backdrop-blur-sm">
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <Input
                placeholder="Type your message..."
                className="flex-1"
                radius="full"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                isDisabled={isLoading}
                classNames={{
                  input: "text-sm text-gray-100 placeholder:text-gray-400",
                  inputWrapper: "bg-gray-900 dark:bg-gray-800 border-gray-700 dark:border-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700/70 focus-within:bg-gray-800 dark:focus-within:bg-gray-700"
                }}
              />
              <Button
                color="primary"
                radius="full"
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-300 px-6 text-white"
                isDisabled={!input.trim() || isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}