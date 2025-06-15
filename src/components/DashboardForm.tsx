"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHome, FaBoxOpen, FaComments, FaListAlt, FaSignOutAlt, FaBars } from "react-icons/fa";

export default function DashboardForm() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`relative transition-all duration-300 ease-in-out bg-gradient-to-br from-indigo-900 to-blue-800 shadow-2xl ${sidebarOpen ? "w-64" : "w-20"} h-screen flex flex-col`}
        style={{ borderTopRightRadius: sidebarOpen ? "2rem" : "1rem", borderBottomRightRadius: sidebarOpen ? "2rem" : "1rem" }}
      >
        {/* Toggle Button - always visible */}
        <button
          className="absolute -right-4 top-6 z-20 bg-blue-800 text-white rounded-full p-2 shadow-lg border-2 border-white hover:bg-blue-700 transition-all focus:outline-none"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label="Toggle Sidebar"
        >
          <FaBars size={22} />
        </button>
        <div className="flex items-center px-4 py-6">
          <span className={`text-white font-extrabold text-2xl tracking-wide transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 w-0"}`}>Dashboard</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2 mt-4">
          <Link
            href="/dashboard"
            onClick={() => setActiveMenu('dashboard')}
            className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors relative
              ${activeMenu === 'dashboard' ? 'bg-blue-700 shadow-[0_4px_24px_0_rgba(49,130,206,0.45),0_1.5px_8px_0_rgba(49,130,206,0.25)] ring-2 ring-indigo-400/60' : 'hover:bg-blue-700'}`}
          >
            <FaHome className="text-xl" />
            <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Main Dashboard</span>
          </Link>
          <button
            type="button"
            onClick={() => setActiveMenu('item')}
            className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors relative w-full text-left
              ${activeMenu === 'item' ? 'bg-blue-700 shadow-[0_4px_24px_0_rgba(49,130,206,0.45),0_1.5px_8px_0_rgba(49,130,206,0.25)] ring-2 ring-indigo-400/60' : 'hover:bg-blue-700'}`}
          >
            <FaBoxOpen className="text-xl" />
            <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Item Management</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMenu('comm')}
            className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors relative w-full text-left
              ${activeMenu === 'comm' ? 'bg-blue-700 shadow-[0_4px_24px_0_rgba(49,130,206,0.45),0_1.5px_8px_0_rgba(49,130,206,0.25)] ring-2 ring-indigo-400/60' : 'hover:bg-blue-700'}`}
          >
            <FaComments className="text-xl" />
            <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Communication Hub</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMenu('log')}
            className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors relative w-full text-left
              ${activeMenu === 'log' ? 'bg-blue-700 shadow-[0_4px_24px_0_rgba(49,130,206,0.45),0_1.5px_8px_0_rgba(49,130,206,0.25)] ring-2 ring-indigo-400/60' : 'hover:bg-blue-700'}`}
          >
            <FaListAlt className="text-xl" />
            <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Action Status Log</span>
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-white hover:bg-red-600 rounded-lg transition-colors mb-6 mt-auto"
        >
          <FaSignOutAlt className="text-xl" />
          <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Logout</span>
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100 min-h-screen relative">
        {/* User Button Top Right */}
        <div className="absolute right-8 top-8 z-10">
          <button className="flex items-center gap-2 bg-white border border-gray-300 shadow px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition">
            <span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">D</span>
            <span>Demo User</span>
          </button>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-600">This is a sample card for dashboard content.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">Statistics</h2>
            <p className="text-gray-600">Display charts or metrics here.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
            <p className="text-gray-600">Show recent updates or logs.</p>
          </div>
        </div>
      </main>
    </div>
  );
} 