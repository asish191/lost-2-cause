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
      {/* Main Content */}
      <main className={`flex-1 p-8 bg-gray-100 min-h-screen relative ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* User Button Top Right */}
        <div className="fixed right-8 top-8 z-10">
          <button className="flex items-center gap-2 bg-white border border-gray-300 shadow px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition">
            <span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">D</span>
            <span>Demo User</span>
          </button>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {/* Items List Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Available Items</h2>
            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
              {/* Item 1 */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Calculus Textbook (3rd Edition)</h3>
                    <p className="text-gray-600 text-sm mt-1">Used for Calculus I & II, includes practice problems and solutions. Condition: Like new, no highlights</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Available</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Textbook</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Mathematics</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Sophomore Year</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Claim Item
                    </button>
                    <Link href="/communicationHub?item=Calculus%20Textbook%20(3rd%20Edition)" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                      Discuss
                    </Link>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Scientific Calculator</h3>
                    <p className="text-gray-600 text-sm mt-1">TI-84 Plus, perfect for engineering and science courses. Includes protective case and manual</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Electronics</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Engineering</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">All Years</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Claim Item
                    </button>
                    <Link href="/communicationHub?item=Scientific%20Calculator" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                      Discuss
                    </Link>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Dorm Room Essentials Kit</h3>
                    <p className="text-gray-600 text-sm mt-1">Includes mini fridge, desk lamp, storage bins, and study chair. Perfect for incoming freshmen</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Available</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Dorm Items</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Furniture</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Freshman Year</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Claim Item
                    </button>
                    <Link href="/communicationHub?item=Dorm%20Room%20Essentials%20Kit" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                      Discuss
                    </Link>
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Programming Laptop</h3>
                    <p className="text-gray-600 text-sm mt-1">MacBook Pro 2020, 16GB RAM, perfect for CS students. Includes programming software and development tools</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Claimed</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Electronics</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Computer Science</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">All Years</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed" disabled>
                      Claimed
                    </button>
                    <Link href="/communicationHub?item=Programming%20Laptop" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                      Discuss
                    </Link>
                  </div>
                </div>
              </div>

              {/* Item 5 */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Chemistry Lab Equipment</h3>
                    <p className="text-gray-600 text-sm mt-1">Complete set of lab equipment including safety goggles, lab coat, and basic glassware. Used for General Chemistry</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Available</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Lab Equipment</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Chemistry</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Freshman Year</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Claim Item
                    </button>
                    <Link href="/communicationHub?item=Chemistry%20Lab%20Equipment" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                      Discuss
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 