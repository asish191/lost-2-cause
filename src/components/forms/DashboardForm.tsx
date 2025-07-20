"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHome, FaBoxOpen, FaComments, FaListAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import Sidebar from "@/features/layout/components/Sidebar";
import { dashboardItems } from '@/constants/items';
import { useAuth } from '@/contexts/AuthContext';
import React from "react";

// ItemCard subcomponent
function ItemCard({
  title,
  description,
  tags,
  status,
  statusColor,
  actions
}: {
  title: string;
  description: string;
  tags: { label: string; color: string }[];
  status: string;
  statusColor: string;
  actions: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`px-2 py-1 ${statusColor} rounded-full text-xs`}>{status}</span>
            {tags.map((tag, idx) => (
              <span key={idx} className={`px-2 py-1 ${tag.color} rounded-full text-xs`}>{tag.label}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </div>
  );
}

export default function DashboardForm() {
  // State for sidebar open/close
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // State for active menu in sidebar
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const router = useRouter();
  const { user } = useAuth();

  // Filter/search state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [filteredItems, setFilteredItems] = useState(dashboardItems);

  // Extract unique locations from tags
  const allLocations = Array.from(
    new Set(
      dashboardItems.flatMap(item =>
        item.tags.map(tag => tag.label)
      )
    )
  );

  // Filtering logic
  function filterItems() {
    let items = dashboardItems;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(s) ||
        item.description.toLowerCase().includes(s)
      );
    }
    if (status) {
      items = items.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }
    if (location) {
      items = items.filter(item =>
        item.tags.some(tag => tag.label.toLowerCase() === location.toLowerCase())
      );
    }
    setFilteredItems(items);
  }

  // Run filter when filter values change
  React.useEffect(() => {
    filterItems();
    // eslint-disable-next-line
  }, [search, status, location]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar navigation */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      {/* Main dashboard content */}
      <main className={`flex-1 p-8 bg-gray-100 min-h-screen relative ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* User info button */}
        <div className="fixed right-8 top-8 z-10">
          <button className="flex items-center gap-2 bg-white border border-gray-300 shadow px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition">
            <span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              {user?.firstName?.[0] || 'U'}
            </span>
            <span>{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
          </button>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#03045e] mb-4">Welcome to Your Dashboard</h1>
          <p className="text-[#03045e]">Manage and view all items in the system</p>
        </div>
        {/* Filter and Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Claimed">Claimed</option>
            </select>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {allLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={filterItems}
              type="button"
            >
              Filter
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {/* Items List Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Available Items</h2>
            {/* Render each item as an ItemCard */}
            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  status={item.status}
                  statusColor={item.statusColor}
                  actions={
                    <>
                      {item.claimable ? (
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                          Claim Item
                        </button>
                      ) : (
                        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed" disabled>
                          Claimed
                        </button>
                      )}
                      <Link href={item.discussHref} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                        Discuss
                      </Link>
                    </>
                  }
                />
              ))}
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