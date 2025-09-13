"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null); // ✅ store sessionId
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ API call to FastAPI backend with session_id
  const askQuestion = async (query: string) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          session_id: sessionId, // send if we already have it
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const data = await res.json();

      // ✅ Save sessionId if backend gave one (first request)
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }

      return data.answer;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = input;
    setInput("");
    setIsLoading(true);

    try {
      const answerText = await askQuestion(query);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answerText ?? "⚠️ No response from assistant.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ Error: ${errMsg}`,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              👋 Start chatting with your AI Assistant.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}

        {/* Loading dots */}
        {isLoading && (
          <div className="flex items-center space-x-2 p-2">
            <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full"></div>
            <div
              className="animate-bounce h-2 w-2 bg-gray-500 rounded-full"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="animate-bounce h-2 w-2 bg-gray-500 rounded-full"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={handleSubmit}
        className="border-t p-4 bg-white dark:bg-gray-800"
      >
        <div className="flex rounded-lg border">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 px-4 bg-blue-600 text-white rounded-r-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
