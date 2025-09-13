const API_BASE_URL = 'http://localhost:8000/api';

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatSession {
  session_id: string;
  title: string;
  preview?: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  messages?: ChatMessage[];
}

export interface SendMessageResponse {
  session_id: string;
  user_message: ChatMessage;
  ai_response: ChatMessage;
}

// Create a new chat session
export const createChatSession = async (): Promise<ChatSession> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.status}`);
  }

  return response.json();
};

// Get all chat sessions
export const getChatSessions = async (): Promise<ChatSession[]> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/`);

  if (!response.ok) {
    throw new Error(`Failed to get sessions: ${response.status}`);
  }

  const data = await response.json();
  return data.sessions;
};

// Get chat history for a specific session
export const getChatHistory = async (sessionId: string): Promise<ChatSession> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/`);

  if (!response.ok) {
    throw new Error(`Failed to get chat history: ${response.status}`);
  }

  return response.json();
};

// Send a message and get AI response
export const sendMessage = async (message: string, sessionId?: string): Promise<SendMessageResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat/send/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.status}`);
  }

  return response.json();
};

// Delete a chat session
export const deleteChatSession = async (sessionId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/delete/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete session: ${response.status}`);
  }
};

// Update session title
export const updateSessionTitle = async (sessionId: string, title: string): Promise<ChatSession> => {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/title/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update session title: ${response.status}`);
  }

  return response.json();
};
