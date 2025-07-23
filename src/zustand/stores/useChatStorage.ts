import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/constants/api';

// Conversation interface based on your API response
interface Conversation {
  _id: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  latestMessage?: string;
}

// Chat state interface
interface ChatState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  setConversations: (conversations: Conversation[]) => void;
  getConversations: () => Promise<void>;
  createConversation: (participantId: string) => Promise<Conversation>;
  sendMessage: (conversationId: string, content: string, messageType?: string) => Promise<any>;
  getMessages: (conversationId: string) => Promise<any>;
  resolveConversation: (conversationId: string) => Promise<any>;
  reset: () => void;
}

const useChatStorage = create<ChatState>()(
  devtools(
    persist(
      (set, get): ChatState => ({
        conversations: [],
        isLoading: false,
        error: null,
        currentPage: 1,
        hasMore: true,

        setConversations: (conversations: Conversation[]) => 
          set({ conversations }),

        reset: () =>
          set({
            conversations: [],
            isLoading: false,
            error: null,
          }),

        // Get Conversations
        getConversations: async () => {
          set({ isLoading: true, error: null });
          try {
            const token = Cookies.get('auth_token');
            if (!token) {
              throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/conversations`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.statusCode === 200) {
              set({ conversations: data.body.conversations });
              return data.body.conversations;
            } else {
              throw new Error(data.message || 'Failed to fetch conversations');
            }
          } catch (err: any) {
            console.error('Error fetching conversations:', err);
            set({ error: err.message || 'Failed to fetch conversations' });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        // Create Conversation
        createConversation: async (participantId: string) => {
          set({ isLoading: true, error: null });
          try {
            const token = Cookies.get('auth_token');
            if (!token) {
              throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/conversations`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ participantId }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.statusCode === 201 || data.statusCode === 200) {
              const newConversation = data.body.conversation;
              set((state) => ({
                conversations: [newConversation, ...state.conversations]
              }));
              return newConversation;
            } else {
              throw new Error(data.message || 'Failed to create conversation');
            }
          } catch (err: any) {
            console.error('Error creating conversation:', err);
            set({ error: err.message || 'Failed to create conversation' });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        // Send Message to Conversation
        sendMessage: async (conversationId: string, content: string, messageType: string = 'text') => {
          set({ isLoading: true, error: null });
          try {
            const token = Cookies.get('auth_token');
            if (!token) {
              throw new Error('No authentication token found');
            }

            const apiUrl = `${API_BASE_URL}/conversations/${conversationId}/messages`;
            console.log('🔍 [Debug] Sending message to URL:', apiUrl);
            console.log('🔍 [Debug] Request body:', { content, messageType });
            
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                content, 
                messageType 
              }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.statusCode === 201 || data.statusCode === 200) {
              // Optionally update the conversation's latest message
              const message = data.body?.message;
              if (message) {
                set((state) => ({
                  conversations: state.conversations.map(conv => 
                    conv._id === conversationId 
                      ? { ...conv, latestMessage: content }
                      : conv
                  )
                }));
              }
              return data.body;
            } else {
              throw new Error(data.message || 'Failed to send message');
            }
          } catch (err: any) {
            console.error('❌ [Debug] Error sending message:', err);
            console.error('❌ [Debug] Error name:', err.name);
            console.error('❌ [Debug] Error message:', err.message);
            console.error('❌ [Debug] Error stack:', err.stack);
            
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
              console.error('❌ [Debug] Network error - check if backend is running on port 3001');
            }
            
            set({ error: err.message || 'Failed to send message' });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        // Get Messages from Conversation
        getMessages: async (conversationId: string) => {
          set({ isLoading: true, error: null });
          try {
            const token = Cookies.get('auth_token');
            if (!token) {
              throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.statusCode === 200) {
              // Return the conversation data with messages
              return data.body;
            } else {
              throw new Error(data.message || 'Failed to get messages');
            }
          } catch (err: any) {
            console.error('Error getting messages:', err);
            set({ error: err.message || 'Failed to get messages' });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        // Resolve Conversation (Schedule for deletion)
        resolveConversation: async (conversationId: string) => {
          set({ isLoading: true, error: null });
          try {
            const token = Cookies.get('auth_token');
            if (!token) {
              throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages/schedule-deletion`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ resolved: true }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.statusCode === 200) {
              // Update the conversation in the local state to mark it as resolved
              set((state) => ({
                conversations: state.conversations.map(conv => 
                  conv._id === conversationId 
                    ? { ...conv, resolved: true, scheduledDeletionDate: data.body.conversation.scheduledDeletionDate, isReadOnly: true }
                    : conv
                )
              }));
              return data.body.conversation;
            } else {
              throw new Error(data.message || 'Failed to resolve conversation');
            }
          } catch (err: any) {
            console.error('Error resolving conversation:', err);
            set({ error: err.message || 'Failed to resolve conversation' });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },
      }),
      {
        name: "chat-storage",
        version: 1,
        storage: createJSONStorage(() => {
          if (typeof window !== "undefined") {
            return localStorage;
          }
          // Server-side fallback storage
          return {
            getItem: (key: string) => null,
            setItem: (key: string, value: string) => {},
            removeItem: (key: string) => {}
          };
        }),
        migrate: (persistedState: any, version: any) => {
          if (typeof persistedState !== "object" || !persistedState?.conversations) {
            return { conversations: [], isLoading: false, error: null };
          }
          return persistedState;
        },
      }
    )
  )
);

export default useChatStorage;
 