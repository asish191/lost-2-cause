"use client";

import { useState } from 'react';
import { COLORS } from '@/constants/colors';
import AdminSidebar from '@/components/common/AdminSidebar';
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

// Demo items (same as DashboardForm)
const items = [
  {
    _id: "687e25b170618cd1087047cb",
    publicId: "my_uploads/j5y6gld6qsgqz3rw5gpm",
    itemName: "hair band",
    itemDescription: "hairband is white",
    status: "lost",
    floor: 2,
    tags: [],
    uploaderName: "Prajwal Reddy",
    uploaderId: "001",
    uploadedAt: "2025-07-21T11:34:09.421Z",
    __v: 0,
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" // hair band
  },
  {
    _id: "687e25b170618cd1087047cc",
    publicId: "my_uploads/abc123",
    itemName: "water bottle",
    itemDescription: "blue bottle with sticker",
    status: "found",
    floor: 1,
    tags: [],
    uploaderName: "Aarav Singh",
    uploaderId: "002",
    uploadedAt: "2025-07-21T12:00:00.000Z",
    __v: 0,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" // water bottle
  },
  {
    _id: "687e25b170618cd1087047cd",
    publicId: "my_uploads/def456",
    itemName: "notebook",
    itemDescription: "red notebook, ruled pages",
    status: "lost",
    floor: 3,
    tags: [],
    uploaderName: "Sara Khan",
    uploaderId: "003",
    uploadedAt: "2025-07-21T12:15:00.000Z",
    __v: 0,
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80" // notebook
  },
  {
    _id: "687e25b170618cd1087047ce",
    publicId: "my_uploads/ghi789",
    itemName: "pencil box",
    itemDescription: "green pencil box with cartoon",
    status: "found",
    floor: 4,
    tags: [],
    uploaderName: "Rohan Mehta",
    uploaderId: "004",
    uploadedAt: "2025-07-21T12:30:00.000Z",
    __v: 0,
    imageUrl: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80" // pencil box
  },
  {
    _id: "687e25b170618cd1087047cf",
    publicId: "my_uploads/jkl012",
    itemName: "lunch box",
    itemDescription: "yellow lunch box, round shape",
    status: "lost",
    floor: 5,
    tags: [],
    uploaderName: "Meera Patel",
    uploaderId: "005",
    uploadedAt: "2025-07-21T12:45:00.000Z",
    __v: 0,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" // lunch box
  },
  {
    _id: "687e25b170618cd1087047d0",
    publicId: "my_uploads/mno345",
    itemName: "geometry box",
    itemDescription: "black geometry box, metallic",
    status: "found",
    floor: 2,
    tags: [],
    uploaderName: "Kabir Das",
    uploaderId: "006",
    uploadedAt: "2025-07-21T13:00:00.000Z",
    __v: 0,
    imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" // geometry box
  }
];

const fallbackUploaderNames = ["Asish", "Manthan", "Prajwal", "Umair", "Prasanth", "Talha"];

function ItemCard({ item, index }: { item: typeof items[number]; index: number }) {
  const uploaderName = item.uploaderName || fallbackUploaderNames[index % fallbackUploaderNames.length];
  const router = useRouter();
  const handleChat = (action: 'claim' | 'lost') => {
    router.push(`/communicationHub?userId=${item.uploaderId}&itemId=${item._id}&action=${action}`);
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.itemName || "Item image"}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{item.itemName || "Unnamed Item"}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.status === 'found'
              ? 'bg-green-100 text-green-800'
              : item.status === 'claimed'
              ? 'bg-purple-100 text-purple-800'
              : item.status === 'resolved'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {(item.status || "unknown").toUpperCase()}
          </span>
        </div>
        <p className="text-gray-600 text-xs mb-1">Uploaded by: <span className="font-medium text-gray-800">{uploaderName}</span></p>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.itemDescription || "No description provided."}</p>
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
          {item.floor && <span className="bg-blue-50 px-2 py-1 rounded">Floor: {item.floor}</span>}
          {item.uploadedAt && <span className="bg-gray-50 px-2 py-1 rounded">{new Date(item.uploadedAt).toLocaleDateString()}</span>}
        </div>
        <div className="mt-auto flex gap-2">
          {item.status === 'found' ? (
            <button
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors w-full"
              onClick={() => handleChat('claim')}
            >
              Claim
            </button>
          ) : item.status === 'lost' ? (
            <button
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition-colors w-full"
              onClick={() => handleChat('lost')}
            >
              Lost
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function AdminViewAllItemsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('viewall');
  const router = useRouter();
  const { user } = useAuth();

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
            <span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              {user?.firstName?.[0] || 'A'}
            </span>
            <span>{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</span>
          </button>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">View All Items</h1>
          <p className="text-gray-600">Manage and view all items in the system</p>
        </div>
        {/* Filter and Search Section (UI only, not functional for demo) */}
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
              <option value="">All Floors</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Filter
            </button>
          </div>
        </div>
        {/* Items Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <ItemCard key={item._id} item={item} index={idx} />
          ))}
          {items.length === 0 && (
            <div className="text-gray-500 text-center py-8 col-span-full">No items found.</div>
          )}
        </div>
      </main>
    </div>
  );
} 