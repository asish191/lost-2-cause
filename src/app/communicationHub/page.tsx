"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/common/AdminSidebar";
import Sidebar from "@/components/common/Sidebar";
import useChatStorage from '@/zustand/stores/useChatStorage';
import CommunicationHubForm from "@/components/forms/CommunicationHubForm";
import { useAuth } from "@/contexts/AuthContext";

// Mock user list for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Alice Admin',
    email: 'alice@admin.com',
    avatar: '',
    status: 'online',
    lastSeen: 'just now',
    unreadCount: 0,
    isBlocked: false,
    isMuted: false,
    isAdmin: true,
  },
  {
    id: '2',
    name: 'Bob User',
    email: 'bob@user.com',
    avatar: '',
    status: 'offline',
    lastSeen: '5 min ago',
    unreadCount: 2,
    isBlocked: false,
    isMuted: false,
    isAdmin: false,
  },
  {
    id: '3',
    name: 'Charlie User',
    email: 'charlie@user.com',
    avatar: '',
    status: 'away',
    lastSeen: '10 min ago',
    unreadCount: 1,
    isBlocked: false,
    isMuted: false,
    isAdmin: false,
  },
] as const;

export default function CommunicationHubPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('comm');
  const router = useRouter();
  const searchParams = useSearchParams();
  // Collect all item details from query params
  const itemDetails = {
    id: searchParams?.get('id'),
    name: searchParams?.get('name'),
    desc: searchParams?.get('desc'),
    status: searchParams?.get('status'),
    floor: searchParams?.get('floor'),
    uploader: searchParams?.get('uploader'),
    image: searchParams?.get('image'),
  };
  const { user: currentUser } = useAuth();
  
  // Access conversation data from Zustand store
  const { 
    conversations: apiConversations, 
    isLoading: isLoadingConversations, 
    error: conversationError,
    getConversations
  } = useChatStorage();

  const isAdmin = currentUser?.isAdmin;

  // Fetch conversations when component mounts
  useEffect(() => {
    if (currentUser?.email) {
      console.log('🚀 [CommunicationHub] Fetching conversations for user:', currentUser.email);
      getConversations();
    }
  }, [currentUser?.email, getConversations]);

  // Log conversation data when it changes
  useEffect(() => {
    if (apiConversations.length > 0) {
      console.log(' [CommunicationHub] API Conversations available:', apiConversations);
      console.log(' [CommunicationHub] Total conversations:', apiConversations.length);
    }
    if (conversationError) {
      console.error(' [CommunicationHub] Conversation error:', conversationError);
    }
  }, [apiConversations, conversationError]);

  // Extract participants from API conversations
  const participantsFromConversations = useMemo(() => {
    if (apiConversations.length === 0) {
      return [...mockUsers];
    }


    const uniqueParticipants = new Set<string>();
    
    // Process each conversation to extract other participants (excluding current user)
    apiConversations.forEach(conversation => {
      conversation.participants.forEach((participant: any) => {
        // Skip if this participant is the current user (same email)
        if (participant?.email === currentUser?.email) {
          console.log('❌ [CommunicationHub] Excluding current user:', participant?.name, `(${participant?.email})`);
          return;
        }

        // Add other participants to the set
        if (participant?._id && participant?.email) {
          console.log('✅ [CommunicationHub] Adding participant:', participant?.name, `(${participant?.email})`);
          uniqueParticipants.add(JSON.stringify(participant));
        }
      });
    });

    // Convert participant objects to user objects for UI
    const participantUsers = Array.from(uniqueParticipants).map(participantString => {
      const participant = JSON.parse(participantString);
      
      // Compare current user email with participant email
      const isCurrentUser = participant.email === currentUser?.email;
      
      console.log(`🔍 [CommunicationHub] Participant: ${participant.name} (${participant.email})`);
      console.log(`🔍 [CommunicationHub] Current user email: ${currentUser?.email}`);
      console.log(`🔍 [CommunicationHub] Is current user: ${isCurrentUser}`);
      
      return {
        id: participant._id,
        name: participant.name,
        email: participant.email,
        avatar: undefined,
        status: isCurrentUser ? 'online' as const : 'online' as const,
        lastSeen: isCurrentUser ? 'You' : 'Just now',
        unreadCount: 0,
        isBlocked: false,
        isMuted: false,
        isAdmin: participant.isAdmin || false,
        isCurrentUser: isCurrentUser, 
      };
    });

    console.log('🔍 [CommunicationHub] Final participants:', participantUsers.length, 'users');

    return participantUsers;
  }, [apiConversations, currentUser?.email]);

  const usersForChat = participantsFromConversations;

  

  return (
    <div className="flex h-screen bg-gray-100">
      {isAdmin ? (
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      ) : (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      )}
      <main className={`flex-1 bg-gray-100 h-screen relative ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <div className="h-full w-full p-4">
          <CommunicationHubForm item={itemDetails} users={usersForChat} />
        </div>
      </main>
    </div>
  );
} 