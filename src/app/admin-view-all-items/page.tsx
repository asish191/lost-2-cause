"use client";

import { useState } from 'react';
import { COLORS } from '@/constants/colors';
import AdminSidebar from '@/components/common/AdminSidebar';
import ItemCard from '@/components/common/ItemCard';
import { FaHome, FaBoxOpen, FaComments, FaListAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AdminViewAllItemsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('viewall');
  const router = useRouter();

  const [items, setItems] = useState([
    {
      id: 1,
      title: 'Lost Laptop Charger',
      description: 'Found a MacBook charger in the cafeteria. Has a white lightning cable.',
      status: 'found',
      tags: ['electronics', 'charger'],
      location: 'Cafeteria',
      date: '2025-06-28',
    },
    {
      id: 2,
      title: 'Lost Student ID',
      description: 'Lost my student ID card somewhere in the library.',
      status: 'lost',
      tags: ['id', 'document'],
      location: 'Library',
      date: '2025-06-27',
    },
    {
      id: 3,
      title: 'Found Keys',
      description: 'Found a set of keys with a red keychain near the parking lot.',
      status: 'found',
      tags: ['keys', 'personal'],
      location: 'Parking Lot',
      date: '2025-06-26',
    },
    {
      id: 4,
      title: 'Lost Water Bottle',
      description: 'Lost my blue water bottle in the gym.',
      status: 'lost',
      tags: ['personal', 'bottle'],
      location: 'Gym',
      date: '2025-06-25',
    },
  ]);

  const handleLogout = () => {
    router.push("/");
  };

  const allowedStatuses = ["found", "lost", "claimed", "resolved"] as const;

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
            <span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">A</span>
            <span>Admin User</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">View All Items</h1>
          <p className="text-gray-600">Manage and view all items in the system</p>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="claimed">Claimed</option>
              <option value="resolved">Resolved</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Locations</option>
              <option value="cafeteria">Cafeteria</option>
              <option value="library">Library</option>
              <option value="gym">Gym</option>
              <option value="parking">Parking Lot</option>
            </select>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Filter
            </button>
          </div>
        </div>

        {/* Items List Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Items ({items.length})</h2>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Export Data
            </button>
          </div>
          <div className="space-y-4">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                title={item.title}
                description={item.description}
                status={allowedStatuses.includes(item.status as any) ? item.status as typeof allowedStatuses[number] : "lost"}
                tags={item.tags}
                location={item.location}
                date={item.date}
                onClaim={() => {
                  // Handle claim logic
                  console.log('Claiming item:', item.id);
                }}
                onReport={() => {
                  // Handle report logic
                  console.log('Reporting item:', item.id);
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 