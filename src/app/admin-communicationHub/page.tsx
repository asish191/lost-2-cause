"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/common/AdminSidebar";
import AdminCommunicationHubForm from "@/components/forms/AdminCommunicationHubForm";

export default function AdminCommunicationHubPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('comm');
  const router = useRouter();
  const searchParams = useSearchParams();
  const item = searchParams?.get('item');

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      {/* Main Content */}
      <main className={`flex-1 bg-gray-100 h-screen relative ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <div className="h-full w-full p-4">
          <AdminCommunicationHubForm item={item} />
        </div>
      </main>
    </div>
  );
} 