"use client";

import { useState } from "react";
import Sidebar from "@/features/layout/components/Sidebar";
import ItemManagementForm from "@/features/items/components/ItemManagementForm";
import { useRouter } from "next/navigation";

export default function ItemManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("item");
  const router = useRouter();

  const handleLogout = () => router.push("/");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      <main
        className={`flex-1 p-8 bg-gray-100 min-h-screen relative ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <div className="fixed right-8 top-8 z-10">
          <button className="flex items-center gap-2 bg-white border border-gray-300 shadow px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition">
            <span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              D
            </span>
            <span>Demo User</span>
          </button>
        </div>
        <ItemManagementForm />
      </main>
    </div>
  );
}
