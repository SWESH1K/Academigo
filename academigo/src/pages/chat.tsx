"use client";

import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Avatar } from "@heroui/avatar";
import { useState } from "react";
import { Navbar } from "@/components/navbar";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today?" },
    { role: "user", content: "Can you recreate the ChatGPT UI?" },
    { role: "assistant", content: "Sure! Here's a HeroUI version of it 🚀" },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="w-full px-2">
        <Navbar/>
      </div>
      <div className="flex flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 dark:border-gray-700 bg-black/90 dark:bg-black/95 backdrop-blur-sm p-4 flex flex-col">
          <Button 
            color="primary" 
            radius="lg" 
            className="mb-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-300 text-white"
          >
            ✨ New Chat
          </Button>
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-gray-300 dark:text-gray-400 mb-2">Recent Conversations</h3>
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
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <Avatar 
                      src="https://i.pravatar.cc/150?img=32" 
                      size="sm" 
                      className="ring-2 ring-gray-700 dark:ring-gray-600"
                    />
                  </div>
                )}
                <div
                  className={`rounded-xl px-4 py-3 max-w-xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-gray-800 to-black text-white shadow-gray-800/30 dark:shadow-black/50"
                      : "bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200 border border-gray-700 dark:border-gray-600"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="flex-shrink-0">
                    <Avatar 
                      src="https://i.pravatar.cc/150?img=5" 
                      size="sm" 
                      className="ring-2 ring-gray-600 dark:ring-gray-500"
                    />
                  </div>
                )}
              </div>
            ))}
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
                isDisabled={!input.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}