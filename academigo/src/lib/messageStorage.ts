interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatHistory {
  messages: Message[];
  lastUpdated: string;
  sessionId: string;
  autoSaveEnabled: boolean;
}

const STORAGE_KEY = 'chat_history';
const AUTO_SAVE_INTERVAL = 1000; // Auto-save every 1 second if there are pending changes

let autoSaveTimeout: NodeJS.Timeout | null = null;

// Generate a session ID for tracking
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Save messages to localStorage as JSON with automatic batching
export const saveMessagesToStorage = (messages: Message[], immediate: boolean = false): void => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    let sessionId = generateSessionId();
    
    // Try to preserve existing session ID if available
    if (existingData) {
      try {
        const existing = JSON.parse(existingData);
        if (existing.sessionId) {
          sessionId = existing.sessionId;
        }
      } catch (e) {
        // If parsing fails, we'll use the new session ID
      }
    }

    const chatHistory: ChatHistory = {
      messages,
      lastUpdated: new Date().toISOString(),
      sessionId,
      autoSaveEnabled: true,
    };

    if (immediate) {
      // Save immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = null;
      }
    } else {
      // Debounced auto-save to prevent excessive localStorage writes
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
      autoSaveTimeout = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
        autoSaveTimeout = null;
      }, AUTO_SAVE_INTERVAL);
    }
  } catch (error) {
    console.error('Failed to save messages to storage:', error);
  }
};

// Force immediate save (useful for critical operations)
export const forceSaveToStorage = (messages: Message[]): void => {
  saveMessagesToStorage(messages, true);
};

// Load messages from localStorage
export const loadMessagesFromStorage = (): Message[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return [];
    }
    
    const chatHistory: ChatHistory = JSON.parse(storedData);
    return chatHistory.messages || [];
  } catch (error) {
    console.error('Failed to load messages from storage:', error);
    return [];
  }
};

// Clear all messages from storage
export const clearMessagesFromStorage = (): void => {
  try {
    // Clear any pending auto-save
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = null;
    }
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear messages from storage:', error);
  }
};

// Get chat history metadata
export const getChatHistoryMetadata = (): { lastUpdated: string | null; messageCount: number; sessionId: string | null; autoSaveEnabled: boolean } => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return { lastUpdated: null, messageCount: 0, sessionId: null, autoSaveEnabled: true };
    }
    
    const chatHistory: ChatHistory = JSON.parse(storedData);
    return {
      lastUpdated: chatHistory.lastUpdated,
      messageCount: chatHistory.messages.length,
      sessionId: chatHistory.sessionId || null,
      autoSaveEnabled: chatHistory.autoSaveEnabled !== false, // Default to true if not specified
    };
  } catch (error) {
    console.error('Failed to get chat history metadata:', error);
    return { lastUpdated: null, messageCount: 0, sessionId: null, autoSaveEnabled: true };
  }
};

// Export messages to a downloadable JSON file
export const exportMessagesToFile = (): void => {
  try {
    const messages = loadMessagesFromStorage();
    const metadata = getChatHistoryMetadata();
    const chatHistory: ChatHistory = {
      messages,
      lastUpdated: new Date().toISOString(),
      sessionId: metadata.sessionId || generateSessionId(),
      autoSaveEnabled: metadata.autoSaveEnabled,
    };
    
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chat_history_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Failed to export messages to file:', error);
  }
};

// Import messages from a JSON file
export const importMessagesFromFile = (file: File): Promise<Message[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const chatHistory: any = JSON.parse(content);
        
        // Support both old and new format
        if (chatHistory.messages && Array.isArray(chatHistory.messages)) {
          resolve(chatHistory.messages);
        } else if (Array.isArray(chatHistory)) {
          // Support direct array format for backward compatibility
          resolve(chatHistory);
        } else {
          reject(new Error('Invalid file format: messages array not found'));
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Auto-save cleanup (call this when component unmounts)
export const cleanupAutoSave = (): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
};

// Check if auto-save is enabled
export const isAutoSaveEnabled = (): boolean => {
  const metadata = getChatHistoryMetadata();
  return metadata.autoSaveEnabled;
};

// Enable/disable auto-save
export const setAutoSaveEnabled = (enabled: boolean): void => {
  try {
    const messages = loadMessagesFromStorage();
    const metadata = getChatHistoryMetadata();
    
    const chatHistory: ChatHistory = {
      messages,
      lastUpdated: new Date().toISOString(),
      sessionId: metadata.sessionId || generateSessionId(),
      autoSaveEnabled: enabled,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  } catch (error) {
    console.error('Failed to update auto-save setting:', error);
  }
};
