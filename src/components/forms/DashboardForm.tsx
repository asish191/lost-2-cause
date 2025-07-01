"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHome, FaBoxOpen, FaComments, FaListAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import Sidebar from "@/components/common/Sidebar";
import { dashboardItems } from '@/constants/items';
import { useSidebar } from "@/components/common/SidebarContext";

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
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  // State for active menu in sidebar
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const router = useRouter();

  // Handle logout action
  const handleLogout = () => {
    router.push("/");
  };

  // Filtered items based on search
  const filteredItems = dashboardItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Suggestions logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }
    const matches = dashboardItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(item => item.title);
    setSuggestions(matches.slice(0, 5));
  }, [searchQuery]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  // Handle input focus/blur
  const handleFocus = () => setShowSuggestions(true);
  const handleBlur = () => setTimeout(() => setShowSuggestions(false), 100);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar navigation */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
      />
      {/* Main dashboard content */}
      <main className={`flex-1 p-8 bg-gray-100 min-h-screen relative ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Heading and Search Bar in a Row */}
        <div className="flex flex-row items-center mb-8 mt-2 w-full gap-8">
          <h1 className="text-3xl font-bold whitespace-nowrap flex-shrink-0">Welcome to Dashboard</h1>
          <div className="relative max-w-xl w-full" style={{ maxWidth: '500px' }}>
            <div className="flex items-center bg-white border-2 border-yellow-400 rounded-full shadow-md px-4 py-2 focus-within:ring-2 focus-within:ring-yellow-300 transition-all" style={{height: 48}}>
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-lg px-2"
                placeholder="search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{fontStyle: 'italic'}}
                aria-label="Search items"
              />
              <button className="ml-2 bg-blue-400 hover:bg-blue-500 transition-colors rounded-full p-2 flex items-center justify-center" style={{width: 40, height: 40}}>
                <MdSearch className="text-white text-2xl" />
              </button>
            </div>
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 cursor-pointer hover:bg-yellow-100 text-gray-800"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* User info button */}
        <div className="fixed right-8 top-8 z-10">
          <button className="flex items-center gap-2 bg-white border border-gray-300 shadow px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition">
            <span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">D</span>
            <span>Demo User</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {/* Items List Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Available Items</h2>
            {/* Render each item as an ItemCard */}
            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
              {filteredItems.length > 0 ? filteredItems.map((item) => (
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
              )) : (
                <div className="text-center text-gray-500 py-8 text-lg">No items found.</div>
              )}
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