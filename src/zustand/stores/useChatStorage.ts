import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/constants/api';

// Helper function to process image messages and ensure proper attachment
const processImageMessage = (msg: any) => {
  if (msg.messageType === 'image') {
    // Check if it's a Cloudinary URL or base64 data URL
    const imageUrl = msg.content;
    const isCloudinaryUrl = typeof imageUrl === 'string' && 
      (imageUrl.includes('cloudinary.com') || imageUrl.includes('res.cloudinary.com'));
    const isDataUrl = typeof imageUrl === 'string' && imageUrl.startsWith('data:image/');
    
    console.log(' [Debug] URL type check - Cloudinary:', isCloudinaryUrl, '| Data URL:', isDataUrl);
    console.log(' [Debug] Image URL preview:', imageUrl?.substring(0, 50) + '...');
    
    // Create transformed message with proper attachment
    return {
      ...msg,
      attachment: msg.attachment || {
        type: 'image',
        url: imageUrl // Use content as URL for image messages
      }
    };
  }
  return msg;
};

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
            console.log('🔑 [Debug] Auth token from cookies:', token ? 'Token found' : 'No token found');
            console.log('🔑 [Debug] Token length:', token?.length || 0);
            console.log('🔑 [Debug] Token preview:', token ? `${token.substring(0, 20)}...` : 'N/A');
            
            if (!token) {
              console.error('❌ [Debug] No authentication token found in cookies');
              throw new Error('No authentication token found');
            }

            console.log('🌐 [Debug] Making request to:', `${API_BASE_URL}/conversations`);
            const response = await fetch(`${API_BASE_URL}/conversations`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            console.log('📡 [Debug] Response status:', response.status);
            console.log('📡 [Debug] Response headers:', Object.fromEntries(response.headers.entries()));

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
            console.log('📥 [Debug] getMessages - Token check:', token ? 'Token found' : 'No token');
            console.log('📥 [Debug] getMessages - Conversation ID:', conversationId);
            
            if (!token) {
              console.error('❌ [Debug] getMessages - No authentication token found');
              throw new Error('No authentication token found');
            }

            const requestUrl = `${API_BASE_URL}/conversations/${conversationId}`;
            console.log('🌐 [Debug] getMessages - Request URL:', requestUrl);
            
            const response = await fetch(requestUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            console.log('📡 [Debug] getMessages - Response status:', response.status);
            console.log('📡 [Debug] getMessages - Response ok:', response.ok);
            console.log('📡 [Debug] getMessages - Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Log full response structure to better understand it
            console.log('📥 [Debug] getMessages - Full response data:', JSON.stringify(data, null, 2));
            
            // Handle different response structures
            if (data.statusCode === 200) {
              // Extract messages from the response
              console.log('📥 [Debug] getMessages - Response body:', data.body);
              
              // Check if messages are in data.body.messages
              if (data.body?.messages?.length > 0) {
                console.log('📥 [Debug] getMessages - Message count:', data.body.messages.length);
                console.log('📥 [Debug] getMessages - First message structure:', JSON.stringify(data.body.messages[0], null, 2));
                console.log('📥 [Debug] getMessages - Message fields:', Object.keys(data.body.messages[0]));
                
                // Transform messages to ensure image messages are properly handled
                const transformedMessages = data.body.messages.map((msg: any) => {
                  // Use the shared helper function to process image messages
                  if (msg.messageType === 'image') {
                    console.log('📷 [Debug] Found image message:', msg._id || msg.id);
                    const processedMsg = processImageMessage(msg);
                    console.log('✅ [Debug] Transformed image message with attachment:', 
                      processedMsg.attachment ? 'yes' : 'no');
                    return processedMsg;
                  }
                  return msg;
                });
                
                return {
                  ...data.body,
                  messages: transformedMessages
                };
              }
              // Check if messages are in data.body.conversation.messages
              else if (data.body?.conversation?.messages?.length > 0) {
                console.log('📥 [Debug] getMessages - Message count (nested):', data.body.conversation.messages.length);
                console.log('📥 [Debug] getMessages - First message structure (nested):', JSON.stringify(data.body.conversation.messages[0], null, 2));
                console.log('📥 [Debug] getMessages - Message fields (nested):', Object.keys(data.body.conversation.messages[0]));
                
                // Transform messages to ensure image messages are properly handled
                const transformedMessages = data.body.conversation.messages.map((msg: any) => {
                  // Use the shared helper function to process image messages
                  if (msg.messageType === 'image') {
                    console.log('📷 [Debug] Found image message (nested):', msg._id || msg.id);
                    const processedMsg = processImageMessage(msg);
                    console.log('✅ [Debug] Transformed image message with attachment (nested):', 
                      processedMsg.attachment ? 'yes' : 'no');
                    return processedMsg;
                  }
                  return msg;
                });
                
                // Return with the expected structure and transformed messages
                return {
                  ...data.body.conversation,
                  messages: transformedMessages
                };
              }
              // Check if messages are directly in the conversation
              else if (data.body?.conversation) {
                console.log('📥 [Debug] getMessages - Conversation found but no messages array');
                console.log('📥 [Debug] getMessages - Conversation keys:', Object.keys(data.body.conversation));
                
                // If there's a messages property that's not an array
                if (data.body.conversation.messages && !Array.isArray(data.body.conversation.messages)) {
                  console.log('📥 [Debug] getMessages - Messages property exists but is not an array');
                  console.log('📥 [Debug] getMessages - Messages type:', typeof data.body.conversation.messages);
                }
                
                return {
                  ...data.body.conversation,
                  messages: []
                };
              }
              else {
                console.log('📥 [Debug] getMessages - No messages found in response');
                return { messages: [] };
              }
            } else {
              console.error('❌ [Debug] getMessages - API error:', data);
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
 