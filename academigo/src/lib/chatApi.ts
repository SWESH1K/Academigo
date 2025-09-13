const API_BASE_URL = 'http://localhost:8000/api';

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ChatAPI {
  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async createSession(): Promise<ApiResponse<{ session_id: string }>> {
    return this.request('/create-session', {
      method: 'POST',
    });
  }

  async getSessions(): Promise<ApiResponse<ChatSession[]>> {
    return this.request('/sessions');
  }

  async getSessionMessages(sessionId: string): Promise<ApiResponse<Message[]>> {
    return this.request(`/sessions/${sessionId}/messages`);
  }

  async sendMessage(sessionId: string, message: string): Promise<ApiResponse<{ response: string }>> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
    });
  }

  async deleteSession(sessionId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }
}

export const chatAPI = new ChatAPI();
