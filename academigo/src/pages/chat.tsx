"use client";

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/navbar";
import { Webchat, Configuration } from '@botpress/webchat';

const clientId = "b84d7ac8-dd77-4e50-a459-9082468c8a50";

export default function ChatPage() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const configuration: Configuration = {
    botName: 'Academigo Assistant',
    botAvatar: '/api/placeholder/32/32',
    botDescription: 'Your AI learning companion',
    showPoweredBy: false,
    color: '#000',
    // theme: 'dark',
  };

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
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
            <h2 className="text-lg font-semibold text-white mb-2">Chat Assistant</h2>
            <p className="text-sm text-gray-400">Your AI learning companion</p>
          </div>

          <div className="flex-1 space-y-4">
            <div className="bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 dark:border-gray-600/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-100 dark:text-gray-200 mb-2">Features</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• AI-powered conversations</li>
                <li>• Export chat history</li>
                <li>• Multiple conversations</li>
                <li>• Markdown support</li>
              </ul>
            </div>

            <div className="bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 dark:border-gray-600/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-100 dark:text-gray-200 mb-2">Tips</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Ask about any topic</li>
                <li>• Request code examples</li>
                <li>• Get learning resources</li>
                <li>• Solve problems together</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {/* Welcome Message */}
          {!isWebchatOpen && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-100 dark:text-gray-200 mb-4">
                  Welcome to Academigo Chat
                </h1>
                <p className="text-gray-400 dark:text-gray-500 mb-6">
                  Start a conversation with your AI assistant. Ask questions, get help with coding, or explore any topic you're interested in.
                </p>
                <button
                  onClick={toggleWebchat}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Chatting
                </button>
              </div>
            </div>
          )}

          {/* Botpress Webchat Integration */}
          <div className="flex-1 relative">
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: isWebchatOpen ? 'block' : 'none',
              }}
            >
              <Webchat
                clientId={clientId}
                configuration={configuration}
              />
            </div>
            {!isWebchatOpen && (
              <button
                onClick={toggleWebchat}
                className="absolute bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-10"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  zIndex: 1000,
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}