"use client";

import { useState } from 'react';
import { COLORS } from '@/constants/colors';
import AdminSidebar from '@/components/common/AdminSidebar';
import ItemManagementForm from "@/features/items/components/ItemManagementForm";
import { FaHome, FaBoxOpen, FaComments, FaListAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

export default function AdminItemManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('upload');
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* Main Content */}
      <main className={`flex-1 p-8 bg-gray-100 min-h-screen relative ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* User Button */}
        <div className="fixed right-8 top-8 z-10">
          <button className="flex items-center gap-2 bg-white border border-gray-300 shadow px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition">
            <span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              {user?.firstName?.[0] || 'A'}
            </span>
            <span>{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Admin Item Management</h1>
        </div>

        {/* Use the same form and item list as the user item management page */}
        <ItemManagementForm />
      </main>
    </div>
  );
} 