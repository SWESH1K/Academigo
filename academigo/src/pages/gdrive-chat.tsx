
"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function GDriveChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/gdrive-rag-answer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.content }),
      });
      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer || data.response || "No answer returned.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching answer.", timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="w-full px-2">
        <Navbar />
      </div>
      <div className="flex flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 dark:border-gray-700 bg-black/90 dark:bg-black/95 backdrop-blur-sm p-4 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white mb-2">GDrive Assistant</h2>
            <p className="text-sm text-gray-400">Document-based AI helper</p>
          </div>

          <div className="flex-1 space-y-4">
            <div className="bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 dark:border-gray-600/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-100 dark:text-gray-200 mb-2">Features</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Ask about your Google Drive docs</li>
                <li>• AI-powered answers</li>
                <li>• Markdown support</li>
                <li>• Fast and private</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {/* Welcome Message */}
          {messages.length === 0 && !loading && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-100 dark:text-gray-200 mb-4">
                  Welcome to GDrive Chat
                </h1>
                <p className="text-gray-400 dark:text-gray-500 mb-6">
                  Start a conversation with your document-based AI assistant. Ask questions about your Google Drive files and get instant answers.
                </p>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3xl px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-blue dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                  {msg.timestamp && (
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Typing indicator */}
            {loading && (
              <div className="flex w-full justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <span className="block w-2 h-2 bg-blue-400 rounded-full animate-typing-bounce"></span>
                  <span className="block w-2 h-2 bg-blue-400 rounded-full animate-typing-bounce delay-150"></span>
                  <span className="block w-2 h-2 bg-blue-400 rounded-full animate-typing-bounce delay-300"></span>
                  <span className="ml-3 text-gray-400 text-sm">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-300 dark:border-gray-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your Google Drive documents..."
                className="flex-1 rounded-2xl border border-gray-300 dark:border-gray-600 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white bg-white/80 shadow-md text-base transition-all duration-200"
                disabled={loading}
                autoFocus
                style={{ minHeight: 48 }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                style={{ minHeight: 48 }}
              >
                {loading ? (
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                ) : (
                  <span>Send</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        .animate-typing-bounce {
          animation: typing-bounce 1.2s infinite both;
        }
        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}
