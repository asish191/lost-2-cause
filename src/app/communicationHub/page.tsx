"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/common/AdminSidebar";
import Sidebar from "@/components/common/Sidebar";
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
  const item = searchParams?.get('item');
  const { user: currentUser } = useAuth();

  const isAdmin = currentUser?.isAdmin;

  const usersForChat = isAdmin ? [...mockUsers] : [...mockUsers].filter(u => u.isAdmin);

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
          <CommunicationHubForm item={item} users={usersForChat} />
        </div>
      </main>
    </div>
  );
} 