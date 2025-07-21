import Link from "next/link";
import Image from "next/image";
import { FaHome, FaBoxOpen, FaComments, FaListAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeMenu,
  setActiveMenu,
}) => {
  const { logout } = useAuth();

  return (
    <aside
      className={`fixed z-30 transition-all duration-500 ease-in-out bg-gradient-to-br from-indigo-900 to-blue-800 shadow-2xl h-screen flex flex-col overflow-y-auto overflow-x-hidden
        ${sidebarOpen ? "w-64" : "w-20"}
        ${sidebarOpen ? "rounded-tr-3xl rounded-br-3xl" : "rounded-tr-xl rounded-br-xl"}
        `}
      style={{ borderTopRightRadius: sidebarOpen ? "2rem" : "1rem", borderBottomRightRadius: sidebarOpen ? "2rem" : "1rem", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
    >
      {/* Toggle Button - always visible */}
      <button
        className="absolute right-0 top-6 -translate-x-1/2 z-40 bg-blue-800 text-white rounded-full p-2 shadow-lg border-2 border-white hover:bg-blue-700 transition-all focus:outline-none"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Sidebar"
      >
        <FaBars size={22} />
      </button>
      <div className="flex flex-col items-start px-4 py-6">
        <div className="flex flex-col items-start gap-2 h-20 justify-center">
          <Image
            src="/lost2Cause_logo.png"
            alt="Lost2Cause Logo"
            width={60}
            height={60}
            className={`rounded-xl shadow-lg border-2 border-white/20 hover:scale-105 transition-transform duration-200 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          />
          <span className={`text-white font-extrabold text-xl tracking-wide transition-all duration-300 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 w-0 invisible"}`}>Lost2Cause</span>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        <Link
          href="/dashboard"
          onClick={() => setActiveMenu('dashboard')}
          className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors transition-transform duration-200 hover:scale-105 focus:scale-105 relative
            ${activeMenu === 'dashboard' ? 'bg-blue-700 shadow-lg ring-2 ring-indigo-400/60 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-cyan-400 before:rounded-l-lg' : 'hover:bg-blue-700'}`}
          style={{ position: 'relative' }}
        >
          <FaHome className="text-xl" />
          <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Main Dashboard</span>
        </Link>
        <Link
          href="/itemManagement"
          onClick={() => setActiveMenu('item')}
          className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors transition-transform duration-200 hover:scale-105 focus:scale-105 relative w-full text-left
            ${activeMenu === 'item' ? 'bg-blue-700 shadow-lg ring-2 ring-indigo-400/60 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-cyan-400 before:rounded-l-lg' : 'hover:bg-blue-700'}`}
          style={{ position: 'relative' }}
        >
          <FaBoxOpen className="text-xl" />
          <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Item Management</span>
        </Link>
        <Link
          href="/communicationHub"
          onClick={() => setActiveMenu('comm')}
          className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors transition-transform duration-200 hover:scale-105 focus:scale-105 relative
            ${activeMenu === 'comm' ? 'bg-blue-700 shadow-lg ring-2 ring-indigo-400/60 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-cyan-400 before:rounded-l-lg' : 'hover:bg-blue-700'}`}
          style={{ position: 'relative' }}
        >
          <FaComments className="text-xl" />
          <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Communication Hub</span>
        </Link>
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-4 px-4 py-3 text-white hover:bg-red-600 rounded-lg transition-colors transition-transform duration-200 hover:scale-105 focus:scale-105 mb-6 mt-auto"
      >
        <FaSignOutAlt className="text-xl" />
        <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar; 
  