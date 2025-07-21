"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/features/layout/components/Sidebar";
import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect } from "react";

// Sample items data (replace with fetch logic as needed)
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

// Helper for fallback uploader names
const fallbackUploaderNames = ["Asish", "Manthan", "Prajwal", "Umair", "Prasanth", "Talha"];

// Redesigned ItemCard subcomponent
function ItemCard({
  item,
  onClaim,
  index
}: {
  item: typeof items[number];
  onClaim?: () => void;
  index: number;
}) {
  // Pick fallback uploader name if missing
  const uploaderName = item.uploaderName || fallbackUploaderNames[index % fallbackUploaderNames.length];
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* Image */}
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.itemName || "Item image"}
          className="w-full h-48 object-cover"
        />
      )}
      {/* Content */}
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
            <button className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors w-full" onClick={onClaim}>
              Claim
            </button>
          ) : (
            <button className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gray-400 cursor-not-allowed w-full" disabled>
              Lost
            </button>
          )}
        </div>
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
  const [showProfile, setShowProfile] = useState(true);

  // Filter/search state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [floor, setFloor] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  // Extract unique floors
  const allFloors = Array.from(new Set(items.map(item => item.floor).filter(Boolean)));

  // Filtering logic
  function filterItems() {
    let filtered = items;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(item =>
        (item.itemName || "").toLowerCase().includes(s) ||
        (item.itemDescription || "").toLowerCase().includes(s)
      );
    }
    if (status) {
      filtered = filtered.filter(item => (item.status || "").toLowerCase() === status.toLowerCase());
    }
    if (floor) {
      filtered = filtered.filter(item => String(item.floor) === floor);
    }
    setFilteredItems(filtered);
  }

  React.useEffect(() => {
    filterItems();
    // eslint-disable-next-line
  }, [search, status, floor]);

  useEffect(() => {
    const handleScroll = () => {
      setShowProfile(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <option value="found">Found</option>
              <option value="lost">Lost</option>
            </select>
            <select
              value={floor}
              onChange={e => setFloor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Floors</option>
              {allFloors.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Redesigned grid for items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <ItemCard
              key={item._id}
              item={item}
              index={idx}
              onClaim={() => {
                // Navigate to communication hub with item details in query params
                const params = new URLSearchParams({
                  id: item._id,
                  name: item.itemName || '',
                  desc: item.itemDescription || '',
                  status: item.status || '',
                  floor: String(item.floor || ''),
                  uploader: item.uploaderName || '',
                  image: item.imageUrl || ''
                });
                router.push(`/communicationHub?${params.toString()}`);
              }}
            />
          ))}
          {filteredItems.length === 0 && (
            <div className="text-gray-500 text-center py-8 col-span-full">No items found.</div>
          )}
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