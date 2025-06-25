import { useState } from "react";
import Link from "next/link";
import { FaHome, FaBoxOpen, FaComments, FaListAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";

const AppBar = ({ activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen, handleLogout }) => (
  <aside
    className={`fixed transition-all duration-300 ease-in-out bg-gradient-to-br from-indigo-900 to-blue-800 shadow-2xl ${sidebarOpen ? "w-64" : "w-20"} h-screen flex flex-col`}
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
    <nav className="flex-1 flex flex-col gap-2 px-2">
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
      <Link
        href="/communicationHub"
        onClick={() => setActiveMenu('comm')}
        className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors relative
          ${activeMenu === 'comm' ? 'bg-blue-700 shadow-[0_4px_24px_0_rgba(49,130,206,0.45),0_1.5px_8px_0_rgba(49,130,206,0.25)] ring-2 ring-indigo-400/60' : 'hover:bg-blue-700'}`}
      >
        <FaComments className="text-xl" />
        <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Communication Hub</span>
      </Link>
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
);

export default AppBar; 