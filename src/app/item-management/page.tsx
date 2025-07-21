"use client";

import { useState, useEffect } from 'react';
import { COLORS } from '@/constants/colors';
import Sidebar from '@/components/common/Sidebar';
import AddItemForm from '@/components/forms/AddItemForm';
import ItemCard from '@/components/common/ItemCard';
import { FaHome, FaBoxOpen, FaComments, FaListAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

export default function ItemManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('item-management');
  const router = useRouter();
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(true);

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

  const allowedStatuses = ["found", "lost", "claimed", "resolved"] as const;

  useEffect(() => {
    const handleScroll = () => {
      setShowProfile(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* Main Content */}
      <main className={`flex-1 p-8 bg-gray-100 min-h-screen relative ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* User Button */}
        {showProfile && (
          <div className="fixed right-8 top-8 z-10">
            <button className="flex items-center gap-3 bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-full font-medium text-gray-800 hover:bg-gray-50 transition min-w-[140px]">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow" />
              ) : (
                <span className="inline-flex w-10 h-10 bg-gradient-to-br from-indigo-900 to-blue-800 text-white rounded-full items-center justify-center font-bold text-xl border-2 border-indigo-500 shadow leading-none select-none tracking-wide">
                  {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                </span>
              )}
              <span className="ml-1 font-semibold text-base truncate max-w-[90px]">{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
            </button>
          </div>
        )}

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
        </div>
      </main>
    </div>
  );
}
