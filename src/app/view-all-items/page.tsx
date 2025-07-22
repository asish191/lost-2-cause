"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import AdminSidebar from '@/components/common/AdminSidebar';
import Sidebar from '@/components/common/Sidebar';
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import useItemsStore from '@/zustand/stores/useItemsStorage'; 
import { Item } from '@/types/item';

// Static demo items (for reference)      
/*
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
*/

function ItemCard({ item, index, isAdmin }: { item:  Item; index: number; isAdmin: boolean }) {
  const uploaderName = item.uploaderName || "Dummy"; // Fallback for uploaderName
  const router = useRouter();
  const handleChat = (action: 'claim' | 'lost') => {
    const params = new URLSearchParams();
    params.set('id', item._id || '');
    params.set('name', item.itemName || '');
    params.set('desc', item.itemDescription || '');
    params.set('status', item.status || '');
    params.set('floor', String(item.floor || ''));
    params.set('uploader', item.uploaderName || '');
    params.set('image', item.imageUrl || '');
    params.set('action', action);
    router.push(`/communicationHub?${params.toString()}`);
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
              disabled={false}
            >
              Claim
            </button>
          ) : item.status === 'lost' ? (
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-yellow-600 transition-colors w-full ${!isAdmin ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-700'}`}
              onClick={isAdmin ? () => handleChat('lost') : undefined}
              disabled={!isAdmin}
              title={!isAdmin ? 'Only admins can use this action' : ''}
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
  const [showProfile, setShowProfile] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [floor, setFloor] = useState("");   
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const router = useRouter();
  const { user } = useAuth(); 
  const { 
    items: itemsStore, 
    getItems: getItemsStore, 
    isLoading,
    hasMore,
    currentPage 
  } = useItemsStore() as {
    items: Item[];
    getItems: (search?: string, page?: number) => Promise<void>;
    isLoading: boolean;
    hasMore: boolean;
    currentPage: number;
  };

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      getItemsStore(searchTerm, 1); // Reset to page 1 when searching
    }, 300),
    [getItemsStore]
  );

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    debouncedSearch(searchTerm);
  };

  // Handle status and floor filters
  useEffect(() => {
    getItemsStore(search, 1); // Reset to page 1 when filters change
  }, [status, floor]);

  // Initial load
  useEffect(() => {
    getItemsStore();
  }, [getItemsStore]);

  // Load more items when scrolling to bottom
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (hasMore && !isLoading) {
        getItemsStore(search, currentPage + 1);
      }
    }
  }, [hasMore, isLoading, currentPage, search, getItemsStore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);




  // Extract unique floors from itemsStore
  const allFloors = useMemo<number[]>(() => {
    return Array.from(new Set((itemsStore || []).map((item: Item) => item.floor).filter(Boolean))).sort() as number[];
  }, [itemsStore]);

  // Effect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setShowProfile(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  const handleLogout = () => {
    router.push("/");
  };

  const allowedStatuses = ["found", "lost", "claimed", "resolved"] as const;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar: Admin for admin, normal for user */}
      {user?.isAdmin ? (
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      ) : (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      )}
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
                  {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || ''}
                </span>
              )}
              <span className="ml-1 font-semibold text-base truncate max-w-[90px]">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</span>
            </button>
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#03045e] mb-4">View All Items</h1>
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
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="claimed">Claimed</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={floor}
              onChange={e => setFloor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Location</option>
              {allFloors.map((f: number) => (
                <option key={String(f)} value={String(f)}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(itemsStore || []).map((item: Item, idx: number) => (
            <ItemCard key={item._id} item={item} index={idx} isAdmin={!!user?.isAdmin} />
          ))}
          {(itemsStore || []).length === 0 && (
            <div className="text-gray-500 text-center py-8 col-span-full">
              {isLoading ? "Loading items..." : "No items found matching your filters."}
            </div>
          )}
          {isLoading && itemsStore?.length > 0 && (
            <div className="col-span-full text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}