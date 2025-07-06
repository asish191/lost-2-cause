import Link from "next/link";
import Image from "next/image";
import { FaHome, FaBoxOpen, FaComments, FaListAlt, FaSignOutAlt, FaBars, FaUpload, FaList, FaTasks, FaRocket, FaChevronDown, FaChevronRight } from "react-icons/fa";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeMenu,
  setActiveMenu,
}) => {
  const [itemMgmtOpen, setItemMgmtOpen] = React.useState(false);
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
        <div className="flex flex-col items-start gap-2">
          <Image
            src="/lost2Cause_logo.png"
            alt="Lost2Cause Logo"
            width={60}
            height={60}
            className="rounded-xl shadow-lg border-2 border-white/20 hover:scale-105 transition-transform duration-200"
          />
          <span className={`text-white font-extrabold text-xl tracking-wide transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 w-0"}`}>Lost2Cause</span>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        <Link
          href="/admin-dashboard"
          onClick={() => setActiveMenu('dashboard')}
          className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors transition-transform duration-200 hover:scale-105 focus:scale-105 relative
            ${activeMenu === 'dashboard' ? 'bg-blue-700 shadow-lg ring-2 ring-indigo-400/60 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-cyan-400 before:rounded-l-lg' : 'hover:bg-blue-700'}`}
          style={{ position: 'relative' }}
        >
          <FaHome className="text-xl" />
          <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Dashboard</span>
        </Link>
        {/* Item Management with sub-navigation */}
        <button
          type="button"
          onClick={() => setItemMgmtOpen((open) => !open)}
          className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors transition-transform duration-200 hover:scale-105 focus:scale-105 w-full text-left relative
            ${(activeMenu === 'item' || activeMenu === 'upload' || activeMenu === 'viewall' || activeMenu === 'manage') ? 'bg-blue-700 shadow-lg ring-2 ring-indigo-400/60 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-cyan-400 before:rounded-l-lg' : 'hover:bg-blue-700'}`}
          style={{ position: 'relative' }}
        >
          <FaBoxOpen className="text-xl" />
          <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Item Management</span>
          {sidebarOpen && (
            <span className="ml-auto">
              {itemMgmtOpen ? <FaChevronDown /> : <FaChevronRight />}
            </span>
          )}
        </button>
        {/* Sub-navigation for Item Management */}
        {itemMgmtOpen && sidebarOpen && (
          <div className="flex flex-col gap-1 ml-10">
            <Link
              href="/admin-itemManagement/add_items"
              onClick={() => setActiveMenu('upload')}
              className={`flex items-center gap-3 px-2 py-2 text-white rounded-md transition-colors transition-transform duration-200 hover:scale-105 focus:scale-105 text-sm relative
                ${activeMenu === 'upload' ? 'bg-blue-600 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-cyan-400 before:rounded-l-md' : 'hover:bg-blue-600'}`}
              style={{ position: 'relative' }}
            >
              <FaUpload className="text-base" />
              Add Items
            </Link>
            <Link
              href="/viewAllItems"
              onClick={() => setActiveMenu('viewall')}
              className={`flex items-center gap-3 px-2 py-2 text-white rounded-md transition-colors transition-transform duration-200 hover:scale-105 focus:scale-105 text-sm relative
                ${activeMenu === 'viewall' ? 'bg-blue-600 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-cyan-400 before:rounded-l-md' : 'hover:bg-blue-600'}`}
              style={{ position: 'relative' }}
            >
              <FaList className="text-base" />
              View All Items
            </Link>

          </div>
        )}
        <Link
          href="/admin-communicationHub"
          onClick={() => setActiveMenu('comm')}
          className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors transition-transform duration-200 hover:scale-105 focus:scale-105 relative
            ${activeMenu === 'comm' ? 'bg-blue-700 shadow-lg ring-2 ring-indigo-400/60 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-cyan-400 before:rounded-l-lg' : 'hover:bg-blue-700'}`}
          style={{ position: 'relative' }}
        >
          <FaComments className="text-xl" />
          <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Admin Communication Hub</span>
        </Link>
        <Link
          href="/admin-launchActionBit"
          onClick={() => setActiveMenu('launch')}
          className={`flex items-center gap-4 px-4 py-3 text-white rounded-lg transition-colors transition-transform duration-200 hover:scale-105 focus:scale-105 relative w-full text-left
            ${activeMenu === 'launch' ? 'bg-blue-700 shadow-lg ring-2 ring-indigo-400/60 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-cyan-400 before:rounded-l-lg' : 'hover:bg-blue-700'}`}
          style={{ position: 'relative' }}
        >
          <FaRocket className="text-xl" />
          <span className={`transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>Launch Action Bit</span>
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

export default AdminSidebar; 