'use client';

import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaPaperclip, FaCheckDouble, FaSmile, FaUser, FaCog, FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { availableReactions, quickReplies, userColors } from '@/constants/communication';
import { handleReaction as handleReactionUtil, simulateAdminResponse as simulateAdminResponseUtil } from '@/utils/communication';

interface Attachment {
  type: 'image';
  url: string;
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  senderRole: 'admin' | 'user' | 'system';
  attachment?: Attachment;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: Reaction[];
}

interface CommunicationHubProps {
  item?: string | null;
}

// MessageList subcomponent
function MessageList({ messages, handleReaction, activePicker, setActivePicker, availableReactions }: {
  messages: Message[];
  handleReaction: (messageId: string, emoji: string) => void;
  activePicker: string | null;
  setActivePicker: (id: string | null) => void;
  availableReactions: string[];
}) {
  return (
    <div className="flex-1 overflow-y-auto px-2 py-4" style={{ maxHeight: '60vh' }}>
      {messages.map((msg) => (
        <div key={msg.id} className={`mb-4 flex ${msg.senderRole === 'user' ? 'justify-end' : 'justify-start'}`}> 
          <div className={`rounded-lg px-4 py-2 shadow-md max-w-xs ${msg.senderRole === 'admin' ? 'bg-indigo-100 text-gray-800' : msg.senderRole === 'system' ? 'bg-gray-200 text-gray-600' : 'bg-blue-600 text-white'}`}> 
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{msg.sender}</span>
              <span className="text-xs text-gray-400">{msg.timestamp}</span>
            </div>
            <div className="whitespace-pre-line break-words">{msg.content}</div>
            {msg.attachment && msg.attachment.type === 'image' && (
              <img src={msg.attachment.url} alt="attachment" className="mt-2 rounded-lg max-h-40" />
            )}
            {/* Reactions */}
            {msg.reactions && (
              <div className="flex gap-1 mt-2">
                {msg.reactions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    className="text-lg px-1 rounded hover:bg-gray-200"
                    onClick={() => handleReaction(msg.id, reaction.emoji)}
                  >
                    {reaction.emoji} <span className="text-xs">{reaction.count}</span>
                  </button>
                ))}
                <button
                  className="text-lg px-1 rounded hover:bg-gray-200"
                  onClick={() => setActivePicker(msg.id)}
                >
                  +
                </button>
                {activePicker === msg.id && (
                  <div className="absolute bg-white border rounded shadow p-2 flex gap-1 z-10">
                    {availableReactions.map((emoji) => (
                      <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-xl hover:bg-gray-100 rounded p-1">{emoji}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
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
  quickReplies,
  showQuickReplies
}: {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  handleSendMessage: (content?: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  quickReplies: { label: string; icon: string; color: string }[];
  showQuickReplies: boolean;
}) {
  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {showQuickReplies && (
        <div className="flex gap-3 mb-3 justify-center">
          {quickReplies.map((reply) => (
            <button
              key={reply.label}
              onClick={() => handleSendMessage(reply.label)}
              className={`flex items-center gap-2 px-4 py-2 font-medium rounded-full transition-colors text-sm ${reply.color}`}
            >
              <span className="text-lg">{reply.icon}</span>
              {reply.label}
            </button>
          ))}
        </div>
      )}
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
          placeholder="Type a message..."
          className="flex-1 w-full px-4 py-3 border-gray-300 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#39cccc] focus:border-[#39cccc]"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-gray-500 hover:text-[#556B2F] transition-colors"
          aria-label="Attach file"
        >
          <FaPaperclip size={20} />
        </button>
        <button
          onClick={() => handleSendMessage()}
          disabled={!newMessage.trim()}
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

export default function CommunicationHubForm({ item }: CommunicationHubProps) {
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

  // Set user color and initial messages on mount or when item changes
  useEffect(() => {
    setUserColor(userColors[Math.floor(Math.random() * userColors.length)]);
    const initialMessages: Message[] = item
      ? [
          {
            id: 'system-1',
            sender: 'System',
            content: `Inquiry about: ${item}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            senderRole: 'system',
          },
          {
            id: 'admin-1',
            sender: 'Admin',
            content: `Hello! How can I help you regarding the ${item}?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            senderRole: 'admin',
          }
        ]
      : [
          {
            id: 'admin-1',
            sender: 'Admin',
            content: 'Hello! How can I assist you today?',
            timestamp: '12:00 PM',
            senderRole: 'admin',
          }
        ];
    setMessages(initialMessages);
  }, [item]);

  // State for new message input
  const [newMessage, setNewMessage] = useState('');
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // Ref for scrolling to the end of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle adding/removing reactions to a message
  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => handleReactionUtil(prev, messageId, emoji, 'You'));
    setActivePicker(null);
  };

  // Simulate admin response after user sends a message
  const simulateAdminResponse = (userMessageId: string) => {
    simulateAdminResponseUtil({
      setIsAdminTyping,
      setMessages,
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

  // Handle sending a new message or image attachment
  const handleSendMessage = (content?: string, attachment?: Attachment) => {
    const messageContent = content || newMessage;
    if (messageContent.trim() || attachment) {
      const messageId = Date.now().toString();
      const message: Message = {
        id: messageId,
        sender: 'You',
        content: messageContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderRole: 'user',
        attachment,
        status: 'sent'
      };
      setMessages(prev => [...prev, message]);
      if (!content) {
        setNewMessage('');
      }
      simulateAdminResponse(messageId);
    }
  };

  // Handle file input change for image attachments
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      handleSendMessage(`Image: ${file.name}`, { type: 'image', url: imageUrl });
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

  return (
    <div className="flex h-[calc(100vh-150px)] max-w-6xl mx-auto bg-gray-100 rounded-2xl shadow-2xl border border-gray-300/80 overflow-hidden mt-15">
      {/* Left Sidebar */}
      <div className="w-80 bg-[#002b55] border-r border-[#001a33] flex flex-col text-white">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#001a33]">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Chat Hub</h2>
            <button className="p-2 text-[#a0d2ff] hover:text-white hover:bg-[#003b73] rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-[#001a33]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#39cccc] to-[#2aa1a1] rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">You</p>
              <p className="text-sm text-[#95e6e6] flex items-center">
                <span className="w-2 h-2 bg-[#39cccc] rounded-full mr-2"></span>
                Online
              </p>
            </div>
            <button className="p-2 text-[#a0d2ff] hover:text-white hover:bg-[#003b73] rounded-lg transition-colors">
              <FaCog className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-[#001a33]">
          <h3 className="font-semibold text-white/90 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 p-3 text-left text-[#a0d2ff] hover:text-white hover:bg-[#003b73] hover:shadow-sm rounded-lg transition-all duration-200">
              <span className="text-xl">🎯</span>
              <span className="font-medium text-sm">Browse Lost Items</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left text-[#a0d2ff] hover:text-white hover:bg-[#003b73] hover:shadow-sm rounded-lg transition-all duration-200">
              <span className="text-xl">📖</span>
              <span className="font-medium text-sm">Help Guide</span>
            </button>
          </div>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="font-semibold text-white/90 mb-3">Recent Chats</h3>
          <div className="space-y-2">
            <div className="p-3 bg-[#003b73]/70 rounded-lg border border-[#003b73] hover:bg-[#003b73] transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">General Support</h4>
                <span className="text-xs text-[#a0d2ff]">2 min ago</span>
              </div>
              <p className="text-sm text-[#a0d2ff]/80 truncate">How can I help you?</p>
            </div>
            <div className="p-3 bg-[#003b73]/70 rounded-lg border border-[#003b73] hover:bg-[#003b73] transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">Item Claim Issue</h4>
                <span className="text-xs text-[#a0d2ff]">1 hour ago</span>
              </div>
              <p className="text-sm text-[#a0d2ff]/80 truncate">I need help claiming an item</p>
              <div className="flex justify-end mt-2">
                <span className="bg-[#808000] text-white text-xs px-2 py-1 rounded-full">2</span>
              </div>
            </div>
            <div className="p-3 bg-[#003b73]/70 rounded-lg border border-[#003b73] hover:bg-[#003b73] transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">Technical Problem</h4>
                <span className="text-xs text-[#a0d2ff]">3 hours ago</span>
              </div>
              <p className="text-sm text-[#a0d2ff]/80 truncate">The app is not working</p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#001a33] bg-[#002b55]">
          <div className="flex items-center justify-between text-sm text-[#a0d2ff]">
            <span>Lost2Cause v1.0</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  soundEnabled 
                    ? 'text-[#39cccc] hover:text-[#95e6e6] hover:bg-[#003b73]' 
                    : 'text-[#a0d2ff] hover:text-white hover:bg-[#003b73]'
                }`}
                aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {soundEnabled ? (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.707zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.707z" clipRule="evenodd" />
                  )}
                </svg>
              </button>
              <button className="p-2 text-[#a0d2ff] hover:text-white hover:bg-[#003b73] rounded-lg transition-colors">
                <FaBell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#002b55] to-[#2aa1a1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#a0d2ff] text-md">Lost2Cause</p>
              <h1 className="font-extrabold text-3xl text-white">Communication Hub</h1>
            </div>
            <div className="flex items-center space-x-3">
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
          {/* Notification Popup */}
          <NotificationPopup show={showNotifications} />
          
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
        </div>

        {/* Quick Replies & Message Input */}
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleKeyPress={handleKeyPress}
          quickReplies={quickReplies}
          showQuickReplies={messages.filter(m => m.senderRole === 'user').length === 0}
        />
      </div>
      
      {/* Audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>
    </div>
  );
}