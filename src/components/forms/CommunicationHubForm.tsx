'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FaSearch, FaPaperclip, FaCheckDouble, FaSmile, FaUser, FaCog, FaBell, FaUsers, FaFilter, FaEllipsisV, FaCircle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { availableReactions, userColors } from '@/constants/communication';
import { handleReaction as handleReactionUtil, simulateAdminResponse as simulateAdminResponseUtil, Message, Reaction } from '@/utils/communication';
import { useAuth } from '@/contexts/AuthContext';
import useChatStorage from '@/zustand/stores/useChatStorage';
import useItemsStore from '@/zustand/stores/useItemsStorage';

interface Attachment {
  type: 'image';
  url: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
  unreadCount: number;
  isBlocked: boolean;
  isMuted: boolean;
  isAdmin?: boolean; // Added isAdmin for filtering
}

interface Conversation {
  id: string;
  userId: string;
  user: User;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface CommunicationHubProps {
  item?: {
    id?: string | null;
    name?: string | null;
    desc?: string | null;
    status?: string | null;
    floor?: string | null;
    uploader?: string | null;
    image?: string | null;
  };
  users: User[];
}



// UserList subcomponent
function UserList({ 
  users, 
  selectedUserId, 
  onUserSelect, 
  searchQuery, 
  setSearchQuery,
  filterStatus,
  setFilterStatus 
}: {
  users: User[];
  selectedUserId: string | null;
  onUserSelect: (userId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}) {
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-80 bg-[#002b55] border-r border-[#001a33] flex flex-col text-white">
      {/* Header */}
      <div className="p-4 border-b border-[#001a33]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Users</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-[#a0d2ff] hover:text-white hover:bg-[#003b73] rounded-lg transition-colors">
              <FaUsers className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#a0d2ff] hover:text-white hover:bg-[#003b73] rounded-lg transition-colors">
              <FaFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-2 bg-[#003b73] border border-[#001a33] rounded-lg text-white placeholder-[#a0d2ff] focus:outline-none focus:ring-2 focus:ring-[#39cccc]"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0d2ff] w-4 h-4" />
        </div>

        {/* Filter */}
        <div className="flex space-x-2">
          {['all', 'online', 'offline', 'away'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-[#39cccc] text-[#002b55]'
                  : 'bg-[#003b73] text-[#a0d2ff] hover:bg-[#004b93]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={`p-4 border-b border-[#001a33] cursor-pointer transition-colors hover:bg-[#003b73] ${
              selectedUserId === user.id ? 'bg-[#003b73] border-l-4 border-l-[#39cccc]' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#39cccc] to-[#2aa1a1] rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <FaUser className="text-white text-sm" />
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#002b55] ${
                  user.status === 'online' ? 'bg-[#39cccc]' :
                  user.status === 'away' ? 'bg-[#f59e0b]' : 'bg-gray-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <div className="flex items-center space-x-1">
                    {user.unreadCount > 0 && (
                      <span className="bg-[#808000] text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {user.unreadCount > 9 ? '9+' : user.unreadCount}
                      </span>
                    )}
                    {user.isBlocked && (
                      <FaTimes className="text-red-400 w-3 h-3" />
                    )}
                    {user.isMuted && (
                      <FaBell className="text-yellow-400 w-3 h-3" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#a0d2ff] truncate">{user.email}</p>
                <p className="text-xs text-[#a0d2ff]/60">{user.lastSeen}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#001a33] bg-[#002b55]">
        <div className="flex items-center justify-between text-sm text-[#a0d2ff]">
          <span>{filteredUsers.length} users</span>
          <span>{users.filter(u => u.status === 'online').length} online</span>
        </div>
      </div>
    </div>
  );
}

// MessageInput subcomponent
function MessageInput({
  newMessage,
  setNewMessage,
  handleSendMessage,
  fileInputRef,
  handleFileChange,
  handleKeyPress,
  selectedUserId
}: {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  handleSendMessage: (content?: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  selectedUserId: string | null;
}) {
  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={selectedUserId ? "Type a message..." : "Select a user to start chatting..."}
          disabled={!selectedUserId}
          className="flex-1 w-full px-4 py-3 border-gray-300 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#39cccc] focus:border-[#39cccc] disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={!selectedUserId}
          className="p-3 text-gray-500 hover:text-[#556B2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Attach file"
        >
          <FaPaperclip size={20} />
        </button>
        <button
          onClick={() => handleSendMessage()}
          disabled={!newMessage.trim() || !selectedUserId}
          className="px-6 py-3 bg-gradient-to-r from-[#002b55] to-[#39cccc] text-white font-semibold rounded-full hover:from-[#003b73] hover:to-[#2aa1a1] focus:outline-none focus:ring-2 focus:ring-[#95e6e6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// NotificationPopup subcomponent
function NotificationPopup({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 right-4 z-50 bg-[#556B2F] text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
        >
          <FaBell className="w-4 h-4" />
          <span className="text-sm font-medium">New message received!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Demo users data - moved outside component to prevent recreation
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'online',
    lastSeen: '2 min ago',
    unreadCount: 3,
    isBlocked: false,
    isMuted: false,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'away',
    lastSeen: '5 min ago',
    unreadCount: 0,
    isBlocked: false,
    isMuted: true,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    status: 'offline',
    lastSeen: '1 hour ago',
    unreadCount: 7,
    isBlocked: true,
    isMuted: false,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    status: 'online',
    lastSeen: '1 min ago',
    unreadCount: 0,
    isBlocked: false,
    isMuted: false,
  },
];

export default function CommunicationHubForm({ item, users }: CommunicationHubProps) {
  const { user: currentUser } = useAuth();
  
  // Chat storage hook
  const { 
    conversations: apiConversations, 
    getConversations, 
    sendMessage,
    getMessages,
    isLoading: isLoadingConversations, 
    error: conversationError 
  } = useChatStorage();
  
  // Items storage hook for image uploads
  const uploadItem = useItemsStore((state: any) => state.uploadItem);
  
  // Use item directly as itemDetails
  const itemDetails = item;
  // Use all users as processed by the main page (no additional filtering)
  const sidebarUsers = useMemo(() => {
    return users; // Show all participants as processed by the main page
  }, [users]);

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // User list states
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState('all');

  // State for chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State for admin typing indicator
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  // State for which message's reaction picker is open
  const [activePicker, setActivePicker] = useState<string | null>(null);
  // Assign a random user color from constants
  const [userColor, setUserColor] = useState<string>('bg-blue-700');
  // State for notification count
  const [notifications, setNotifications] = useState<number>(0);
  // State for showing notification popup
  const [showNotifications, setShowNotifications] = useState(false);
  // State for sound enabled/disabled
  const [soundEnabled, setSoundEnabled] = useState(true);
  // Ref for audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // State for user dropdown menu
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Initialize conversations for each user
  useEffect(() => {
    const initialConversations: Conversation[] = users.map(user => ({
      id: `conv-${user.id}`,
      userId: user.id,
      user,
      messages: [
        {
          id: `admin-${user.id}-1`,
          sender: 'Admin',
          content: `Hello ${user.name}! How can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senderRole: 'admin',
          conversationId: `conv-${user.id}`,
        }
      ],
      lastMessage: `Hello ${user.name}! How can I help you today?`,
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: user.unreadCount,
    }));
    setConversations(initialConversations);
    
    // Select first user by default only if no user is currently selected
    if (users.length > 0 && selectedUserId === null) {
      setSelectedUserId(users[0].id);
    }
  }, [users]); // Removed selectedUserId from dependencies

  // Fetch conversations from API on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        console.log('🔄 Fetching conversations from API...');
        await getConversations();
        console.log('✅ Conversations fetched successfully:', apiConversations);
      } catch (error) {
        console.error('❌ Failed to fetch conversations:', error);
      }
    };

    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser, getConversations]);

  // Log API conversations when they change
  useEffect(() => {
    if (apiConversations.length > 0) {
      console.log('📋 API Conversations updated:', apiConversations);
    }
  }, [apiConversations]);

  // Load messages when user is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedUserId) {
        setMessages([]);
        return;
      }

      // Find the real conversation ID from API conversations
      const realConversationId = findConversationId(selectedUserId);
      if (!realConversationId) {
        console.error('❌ Could not find conversation ID for loading messages:', selectedUserId);
        setMessages([]);
        return;
      }

      try {
        console.log('📥 Loading messages for conversation:', realConversationId);
        const conversationData = await getMessages(realConversationId);
        
        if (conversationData && conversationData.messages) {
          console.log('✅ Loaded messages:', conversationData.messages.length);
          setMessages(conversationData.messages);
        } else {
          console.log('ℹ️ No messages found in conversation');
          setMessages([]);
        }
        
        // Mark messages as read in local state
        const conversation = conversations.find(conv => conv.userId === selectedUserId);
        if (conversation && conversation.unreadCount > 0) {
          setConversations(prev => prev.map(conv => 
            conv.userId === selectedUserId 
              ? { ...conv, unreadCount: 0 }
              : conv
          ));
        }
        
      } catch (error) {
        console.error('❌ Failed to load messages:', error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedUserId, apiConversations, getMessages]); // Use apiConversations instead of mock conversations

  // Update messages when selected user changes
  useEffect(() => {
    if (selectedUserId) {
      const conversation = conversations.find(conv => conv.userId === selectedUserId);
      if (conversation) {
        setMessages(conversation.messages);
        // Mark messages as read - only update if unreadCount > 0
        if (conversation.unreadCount > 0) {
          setConversations(prev => prev.map(conv => 
            conv.userId === selectedUserId 
              ? { ...conv, unreadCount: 0 }
              : conv
          ));
        }
      }
    }
  }, [selectedUserId, conversations]); // Added conversations to dependencies

  // Set user color on mount
  useEffect(() => {
    setUserColor(userColors[Math.floor(Math.random() * userColors.length)]);
  }, []);



  // State for new message input
  const [newMessage, setNewMessage] = useState('');
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // Ref for scrolling to the end of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle adding/removing reactions to a message
  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => {
      const updated = handleReactionUtil(prev, messageId, emoji, 'Admin');
      // Update conversations with the new messages
      if (selectedUserId) {
        setConversations(prevConversations => prevConversations.map(conv => 
          conv.userId === selectedUserId 
            ? { ...conv, messages: updated }
            : conv
        ));
      }
      return updated;
    });
    setActivePicker(null);
  };

  // Simulate admin response after user sends a message
  const simulateAdminResponse = (userMessageId: string) => {
    simulateAdminResponseUtil({
      setIsAdminTyping,
      setMessages: (updater) => {
        setMessages(updater);
        // Update conversations with the new messages
        if (selectedUserId) {
          setConversations(prevConversations => {
            const updatedMessages = typeof updater === 'function' ? updater(messages) : updater;
            return prevConversations.map(conv => 
              conv.userId === selectedUserId 
                ? { ...conv, messages: updatedMessages }
                : conv
            );
          });
        }
      },
      setNotifications,
      setShowNotifications,
      audioRef,
      soundEnabled,
      userMessageId
    });
  };

  // Clear notification count and hide popup
  const clearNotifications = () => {
    setNotifications(0);
    setShowNotifications(false);
  };

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setActivePicker(null);
    setShowUserDropdown(false);
  };

  // Handle block user
  const handleBlockUser = () => {
    if (selectedUserId) {
      setConversations(prev => prev.map(conv => 
        conv.userId === selectedUserId 
          ? { ...conv, user: { ...conv.user, isBlocked: !conv.user.isBlocked } }
          : conv
      ));
    }
    setShowUserDropdown(false);
  };

  // Handle mute user
  const handleMuteUser = () => {
    if (selectedUserId) {
      setConversations(prev => prev.map(conv => 
        conv.userId === selectedUserId 
          ? { ...conv, user: { ...conv.user, isMuted: !conv.user.isMuted } }
          : conv
      ));
    }
    setShowUserDropdown(false);
  };

  // Helper function to find real conversation ID from API conversations
  const findConversationId = (userId: string): string | null => {
    if (!apiConversations || apiConversations.length === 0) {
      return null;
    }
    
    // Find conversation where the selected user is a participant
    const conversation = apiConversations.find(conv => 
      conv.participants.some((participant: any) => 
        participant._id === userId || participant.id === userId
      )
    );
    
    return conversation?._id || null;
  };

  // Handle sending a new message or image attachment
  const handleSendMessage = async (content?: string, attachment?: Attachment) => {
    const messageContent = content || newMessage;
    if (!messageContent.trim() && !attachment) {
      return;
    }

    if (!selectedUserId) {
      console.error('No user selected for messaging');
      return;
    }

    // Find the real conversation ID from API conversations
    const realConversationId = findConversationId(selectedUserId);
    console.log('🔍 [Debug] Selected user ID:', selectedUserId);
    console.log('🔍 [Debug] Found conversation ID:', realConversationId);
    console.log('🔍 [Debug] Available conversations:', apiConversations);
    
    if (!realConversationId) {
      console.error('❌ Could not find conversation ID for user:', selectedUserId);
      console.error('❌ Available conversations:', apiConversations?.map(c => ({ id: c._id, participants: c.participants })));
      return;
    }

    // Create message ID outside try block for error handling
    const messageId = Date.now().toString();
    
    try {
      // Create optimistic message for immediate UI update
      const optimisticMessage: Message = {
        id: messageId,
        sender: currentUser?.firstName || 'You',
        content: messageContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderRole: 'admin',
        conversationId: realConversationId,
        attachment,
        status: 'sending' // Show as sending initially
      };
      
      // Update messages for immediate UI feedback
      setMessages(prev => [...prev, optimisticMessage]);
      
      // Send message via API
      console.log('🚀 Sending message to conversation:', realConversationId);
      const response = await sendMessage(realConversationId, messageContent, attachment ? 'image' : 'text');
      
      // Update message status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'sent' }
          : msg
      ));
      
      // Update local conversation state
      if (selectedUserId) {
        setConversations(prev => prev.map(conv => 
          conv.userId === selectedUserId 
            ? {
                ...conv,
                messages: [...conv.messages.filter(m => m.id !== messageId), { ...optimisticMessage, status: 'sent' }],
                lastMessage: messageContent,
                lastMessageTime: optimisticMessage.timestamp,
              }
            : conv
        ));
      }
      
      console.log('✅ Message sent successfully:', response);
      
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      
      // Update message status to failed
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'failed' }
          : msg
      ));
      
      // Optionally show error to user
      alert('Failed to send message. Please try again.');
    }
    
    // Clear input if not a content parameter (user typed message)
    if (!content) {
      setNewMessage('');
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle file input change for image attachments
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      let base64DataUrl: string;
      
      try {
        console.log('📷 Converting image to base64:', file.name);
        
        // Convert file to base64 data URL
        base64DataUrl = await fileToBase64(file);
        console.log('✅ Image converted to base64');
        
      } catch (error) {
        console.error('❌ Failed to convert image to base64:', error);
        alert('Failed to process image. Please try again.');
        return;
      }
      
      // Check if user is selected
      if (!selectedUserId) {
        console.error('❌ No user selected for image message');
        alert('Please select a user to send image to.');
        return;
      }

      // Find the real conversation ID from API conversations
      const realConversationId = findConversationId(selectedUserId);
      if (!realConversationId) {
        console.error('❌ Could not find conversation ID for image message:', selectedUserId);
        alert('Could not send image. Please try again.');
        return;
      }

      try {
        // Send message with base64 data as content and messageType: "image"
        console.log('🚀 Sending base64 image message to conversation:', realConversationId);
        await sendMessage(realConversationId, base64DataUrl, 'image');
        console.log('✅ Base64 image message sent successfully');
        
      } catch (error) {
        console.error('❌ Failed to send image message:', error);
        alert('Failed to send image message. Please check your connection and try again.');
      }
    }
    // Reset file input
    if (e.target) e.target.value = '';
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to the latest message when messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAdminTyping]);

  // Filter messages based on search query
  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current selected user
  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  return (
    <div className="flex h-full w-full bg-gray-100 rounded-2xl shadow-2xl border border-gray-300/80 overflow-hidden">
      {/* User List Sidebar with profile at top */}
      <div className="w-80 bg-[#002b55] border-r border-[#001a33] flex flex-col text-white">
        {/* Profile section at top */}
        <div className="p-6 border-b border-[#001a33] flex flex-col items-center gap-4">
          {/* Current user avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#39cccc] to-[#2aa1a1] flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {currentUser?.firstName ? currentUser.firstName[0] : 'U'}
            {currentUser?.lastName ? currentUser.lastName[0] : ''}
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-white">{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}</div>
            <div className="text-xs text-[#a0d2ff]">{currentUser?.email}</div>
          </div>
        </div>
        {/* User List */}
        <UserList
          users={sidebarUsers}
          selectedUserId={selectedUserId}
          onUserSelect={handleUserSelect}
          searchQuery={userSearchQuery}
          setSearchQuery={setUserSearchQuery}
          filterStatus={userFilterStatus}
          setFilterStatus={setUserFilterStatus}
        />
        {/* Footer remains unchanged */}
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#002b55] to-[#2aa1a1]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-bold text-[#a0d2ff] text-md">Lost2Cause</p>
                <h1 className="font-extrabold text-2xl text-white">Communication Hub</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button
                onClick={clearNotifications}
                className="relative p-3 text-white/80 hover:text-white hover:bg-[#003b73]/70 rounded-full transition-all duration-200"
                aria-label="Notifications"
              >
                <FaBell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#808000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>
              {/* User Display with Dropdown */}
              {selectedUser && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#39cccc] to-[#2aa1a1] rounded-full flex items-center justify-center">
                        {selectedUser.avatar ? (
                          <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <FaUser className="text-white text-sm" />
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#002b55] ${
                        selectedUser.status === 'online' ? 'bg-[#39cccc]' :
                        selectedUser.status === 'away' ? 'bg-[#f59e0b]' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-white text-sm">
                        {selectedUser.name}
                      </p>
                      <p className="text-xs text-[#a0d2ff] capitalize">
                        {selectedUser.status}
                      </p>
                    </div>
                    <FaEllipsisV className="text-white/60 w-4 h-4" />
                  </button>
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div className="p-2">
                          <button
                            onClick={handleBlockUser}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedUser.isBlocked 
                                ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <FaTimes className={`w-4 h-4 ${selectedUser.isBlocked ? 'text-red-500' : 'text-gray-400'}`} />
                            <span>{selectedUser.isBlocked ? 'Unblock User' : 'Block User'}</span>
                          </button>
                          <button
                            onClick={handleMuteUser}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedUser.isMuted 
                                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <FaBell className={`w-4 h-4 ${selectedUser.isMuted ? 'text-yellow-500' : 'text-gray-400'}`} />
                            <span>{selectedUser.isMuted ? 'Unmute User' : 'Mute User'}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#39cccc] focus:border-[#39cccc]"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-[#f0f4e4] relative" onClick={() => setActivePicker(null)}>
          {/* Regarding this item system message */}
          {itemDetails && itemDetails.name && selectedUserId && (
            <div className="flex justify-center mb-4">
              <div className="max-w-lg px-4 py-2 rounded-full shadow-sm bg-blue-100 text-blue-900 text-xs italic flex items-center gap-2">
                <span>Regarding this item:</span>
                <span className="font-semibold">{itemDetails.name}</span>
                {itemDetails.desc && <span className="text-gray-700">- {itemDetails.desc}</span>}
                {itemDetails.image && (
                  <img src={itemDetails.image} alt={itemDetails.name || ''} className="w-8 h-8 object-cover rounded-md border ml-2" />
                )}
              </div>
            </div>
          )}
          {/* Notification Popup */}
          <NotificationPopup show={showNotifications} />
          
          {!selectedUserId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#39cccc] to-[#2aa1a1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a User</h3>
                <p className="text-gray-500">Choose a user from the sidebar to start a conversation</p>
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`group flex flex-col ${
                      message.senderRole === 'user' ? 'items-end' : 
                      message.senderRole === 'system' ? 'items-center' : 'items-start'
                    }`}
                  >
                    {message.senderRole === 'system' ? (
                      <div className="max-w-lg px-4 py-2 my-2 rounded-full shadow-sm bg-gray-200 text-gray-700 text-xs italic">
                        <p>{message.content}</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div
                          className={`max-w-lg px-5 py-3 rounded-2xl shadow-sm ${
                            message.senderRole === 'user'
                              ? `${userColor} text-white`
                              : 'bg-white text-gray-800 border border-gray-200/80 shadow-md'
                          }`}
                        >
                          {message.attachment?.type === 'image' && (
                            <img src={message.attachment.url} alt="Uploaded content" className="rounded-lg mb-2 max-h-48" />
                          )}
                          {message.content && <p className="text-sm">{message.content}</p>}
                        </div>
                        <AnimatePresence>
                          {activePicker === message.id && (
                              <motion.div 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className={`absolute -top-10 flex items-center gap-1 bg-white border border-gray-200 rounded-full shadow-lg p-1 ${message.senderRole === 'user' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}`}
                                  onClick={(e) => e.stopPropagation()}
                              >
                                  {availableReactions.map(emoji => (
                                      <button key={emoji} onClick={() => handleReaction(message.id, emoji)} className="text-xl p-1 rounded-full hover:bg-gray-100 transition-colors">
                                          {emoji}
                                      </button>
                                  ))}
                              </motion.div>
                          )}
                        </AnimatePresence>

                        <div
                          className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity
                          ${message.senderRole === 'user' ? '-left-4 -translate-x-full' : '-right-4 translate-x-full'}`}
                          onClick={(e) => {
                              e.stopPropagation();
                              setActivePicker(activePicker === message.id ? null : message.id)
                          }}
                        >
                          <FaSmile />
                        </div>

                        {message.reactions && message.reactions.length > 0 && (
                          <div className={`absolute -bottom-4 flex gap-1.5 ${message.senderRole === 'user' ? 'right-2' : 'left-2'}`}>
                            {message.reactions.map(r => (
                              <div key={r.emoji} className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm border border-gray-200/60">
                                <span className="text-sm">{r.emoji}</span>
                                <span className="text-xs font-semibold text-[#002b55]">{r.count}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 px-1 pt-4">
                      {message.senderRole === 'user' && message.status === 'read' && (
                          <FaCheckDouble className="text-[#39cccc]" size={12} />
                      )}
                      <span className="text-xs text-gray-500">
                        {message.timestamp}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isAdminTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start"
                >
                  <div className="max-w-lg px-5 py-3 rounded-2xl shadow-sm bg-white text-gray-800 border border-gray-200/80">
                      <div className="flex items-center justify-center gap-1.5">
                          <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleKeyPress={handleKeyPress}
          selectedUserId={selectedUserId}
        />
      </div>
      
      {/* Audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>
    </div>
  );
}