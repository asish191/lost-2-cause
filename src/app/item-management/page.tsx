"use client";

import { useState } from 'react';
import { COLORS } from '@/constants/colors';
import Sidebar from '@/components/common/Sidebar';
import AddItemForm from '@/components/forms/AddItemForm';
import ItemCard from '@/components/common/ItemCard';
import { FaHome, FaBoxOpen, FaComments, FaListAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ItemManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('item-management');
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
  ]);

  const handleAddItem = (item: any) => {
    setItems(prev => [
      ...prev,
      {
        id: prev.length + 1,
        ...item,
        status: item.type === 'lost' ? 'lost' : 'found',
      },
    ]);
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className={`flex-1 p-8 bg-gray-100 min-h-screen relative ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* User Button */}
        <div className="fixed right-8 top-8 z-10">
          <button className="flex items-center gap-2 bg-white border border-gray-300 shadow px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition">
            <span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">D</span>
            <span>Demo User</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Item Management</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Add Item Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <AddItemForm onSubmit={handleAddItem} />
          </div>

          {/* Items List Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  status={item.status}
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
        </div>
      </main>
    </div>
  );
}
