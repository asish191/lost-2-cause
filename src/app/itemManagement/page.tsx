"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/features/layout/components/Sidebar";
import AdminSidebar from "@/components/common/AdminSidebar";
import ItemManagementForm from "@/features/items/components/ItemManagementForm";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

export default function ItemManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  // Set activeMenu based on user role
  const [activeMenu, setActiveMenu] = useState(user?.isAdmin ? "upload" : "item");
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowProfile(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(user?.isAdmin ? "upload" : "item");
  }, [user]);

  const handleLogout = () => router.push("/");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {user?.isAdmin ? (
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
      <main
        className={`flex-1 p-8 bg-gray-100 min-h-screen relative ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <h1 className="text-3xl font-bold mb-8 text-[#03045e]">Report for Lost Items or Found Items</h1>
        <div className="h-4" />
        {showProfile && (
          <div className="fixed right-8 top-8 z-10">
            <button className="flex items-center gap-3 bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-full font-medium text-gray-800 hover:bg-gray-50 transition min-w-[140px]">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow" />
              ) : (
                <span className="inline-flex w-10 h-10 bg-gradient-to-br from-indigo-900 to-blue-800 text-white rounded-full items-center justify-center font-bold text-xl border-2 border-indigo-500 shadow leading-none select-none tracking-wide">
                  {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                </span>
              )}
              <span className="ml-1 font-semibold text-base truncate max-w-[90px]">{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
            </button>
          </div>
        )}
        <ItemManagementForm />
      </main>
    </div>
  );
}
