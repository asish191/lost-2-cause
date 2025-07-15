// Communication Hub utility functions

// Minimal types for Message and Reaction
export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  senderRole: 'admin' | 'user' | 'system';
  conversationId: string;
  attachment?: { type: 'image'; url: string };
  status?: 'sent' | 'delivered' | 'read';
  reactions?: Reaction[];
}

/**
 * Handles adding/removing reactions to a message.
 * @param messages - Current messages array
 * @param messageId - ID of the message to react to
 * @param emoji - Emoji to react with
 * @param currentUser - The user performing the reaction
 * @returns Updated messages array
 */
export function handleReaction(
  messages: Message[],
  messageId: string,
  emoji: string,
  currentUser: string = 'You'
): Message[] {
  return messages.map((msg: Message) => {
    if (msg.id === messageId) {
      const reactions = msg.reactions ? [...msg.reactions] : [];
      const existingReaction = reactions.find((r: Reaction) => r.emoji === emoji);
      if (existingReaction) {
        if (existingReaction.users.includes(currentUser)) {
          existingReaction.count -= 1;
          existingReaction.users = existingReaction.users.filter((u: string) => u !== currentUser);
        } else {
          existingReaction.count += 1;
          existingReaction.users.push(currentUser);
        }
        const updatedReactions = reactions.filter((r: Reaction) => r.count > 0);
        return { ...msg, reactions: updatedReactions.length > 0 ? updatedReactions : undefined };
      } else {
        reactions.push({ emoji, count: 1, users: [currentUser] });
        return { ...msg, reactions };
      }
    }
    return msg;
  });
}

/**
 * Simulates an admin response after a user message.
 */
export function simulateAdminResponse({
  setIsAdminTyping,
  setMessages,
  setNotifications,
  setShowNotifications,
  audioRef,
  soundEnabled,
  userMessageId
}: {
  setIsAdminTyping: (typing: boolean) => void;
  setMessages: (fn: (prev: Message[]) => Message[]) => void;
  setNotifications: (fn: (prev: number) => number) => void;
  setShowNotifications: (show: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  soundEnabled: boolean;
  userMessageId: string;
}) {
  setIsAdminTyping(true);
  setTimeout(() => {
    setMessages((prev: Message[]) => prev.map(msg => msg.id === userMessageId ? { ...msg, status: 'read' } : msg));
  }, 1000);
  setTimeout(() => {
    setIsAdminTyping(false);
    const reply: Message = {
      id: `admin-${Date.now()}`,
      sender: 'Admin',
      content: "Thanks for reaching out! I'm looking into this for you and will get back to you shortly.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderRole: 'admin',
      conversationId: 'default', // Add this line
    };
    setMessages((prev: Message[]) => [...prev, reply]);
    setNotifications((prev: number) => prev + 1);
    setShowNotifications(true);
    setTimeout(() => setShowNotifications(false), 3000);
    if (audioRef.current && soundEnabled) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  }, 3000);
} 