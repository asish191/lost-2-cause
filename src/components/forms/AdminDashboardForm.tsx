'use client';

import React, { useEffect, useState } from "react";
import AdminSidebar from "../common/AdminSidebar";

// Demo API function to simulate fetching metrics
type Metrics = {
  totalItemsUploaded: number;
  totalItemsReturned: number;
  totalItemsWaiting: number;
  totalItemsSentToAction: number;
  totalUserNumber: number;
};

const fetchMetrics = async (): Promise<Metrics> => {
  // Simulate API delay
  await new Promise((res) => setTimeout(res, 600));
  // Demo data
  return {
    totalItemsUploaded: 120,
    totalItemsReturned: 45,
    totalItemsWaiting: 15,
    totalItemsSentToAction: 30,
    totalUserNumber: 200,
  };
};

const metricBoxes = [
  {
    key: "totalItemsUploaded",
    label: "Total Items Uploaded",
    icon: "⬆️",
    gradient: "linear-gradient(135deg, #0d47a1 0%, #560bad 100%)",
    iconBg: "rgba(255, 255, 255, 0.2)",
    featured: true,
  },
  {
    key: "totalItemsReturned",
    label: "Items Returned",
    icon: "🔄",
    gradient: "linear-gradient(135deg, #560bad 0%, #0d47a1 100%)",
    iconBg: "rgba(255, 255, 255, 0.2)",
    featured: false,
  },
  {
    key: "totalItemsWaiting",
    label: "Items Waiting",
    icon: "⏳",
    gradient: "linear-gradient(135deg, #560bad 0%, #7c3aed 100%)",
    iconBg: "rgba(255, 255, 255, 0.2)",
    featured: false,
  },
  {
    key: "totalItemsSentToAction",
    label: "Sent to Action",
    icon: "🚀",
    gradient: "linear-gradient(135deg, #0d47a1 0%, #1e40af 100%)",
    iconBg: "rgba(255, 255, 255, 0.2)",
    featured: false,
  },
  {
    key: "totalUserNumber",
    label: "Total Users",
    icon: "👤",
    gradient: "linear-gradient(135deg, #0d47a1 0%, #3b82f6 100%)",
    iconBg: "rgba(255, 255, 255, 0.2)",
    featured: false,
  },
];

const AdminDashboardForm: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');



  useEffect(() => {
    let mounted = true;
    fetchMetrics().then((data) => {
      if (mounted) {
        setMetrics(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const featuredBox = metricBoxes.find(box => box.featured);
  const regularBoxes = metricBoxes.filter(box => !box.featured);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <AdminSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      <main
        className={`transition-all duration-500 flex-1 p-8
          ${sidebarOpen ? 'ml-64' : 'ml-20'}
        `}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#03045e] mb-2">Dashboard Overview</h1>
          <p className="text-[#03045e] text-xl">Chronicles of Lost Item Claims Legacy</p>
        </div>
        
        <section aria-label="Dashboard Metrics" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Large Box - Left Side */}
          {featuredBox && (
            <div
              tabIndex={0}
              role="region"
              aria-label={featuredBox.label}
              className="lg:col-span-1 relative rounded-3xl shadow-2xl p-8 flex flex-col items-start justify-between min-h-[500px] cursor-pointer group transition-all duration-300 hover:scale-105 focus:scale-105 outline-none overflow-hidden"
              style={{ background: featuredBox.gradient }}
            >
              {/* Background pattern overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              
              {/* Icon with background */}
              <div 
                className="relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110"
                style={{ background: featuredBox.iconBg }}
              >
                <span className="text-4xl" aria-hidden="true">{featuredBox.icon}</span>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <span className="text-2xl font-bold mb-6 text-white drop-shadow-lg leading-tight">{featuredBox.label}</span>
                <span className="text-8xl font-black text-white drop-shadow-lg transition-all duration-500">
                  {loading ? (
                    <span className="animate-pulse text-6xl">Loading...</span>
                  ) : metrics ? (
                    <span className="animate-in slide-in-from-bottom-2 duration-500">
                      {metrics[featuredBox.key as keyof Metrics]}
                    </span>
                  ) : (
                    "-"
                  )}
                </span>
                <div className="mt-6">
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div className="bg-white/40 h-3 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-white/80 text-sm mt-2">75% of target achieved</p>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}

          {/* Right Side - 4 Smaller Boxes */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {regularBoxes.map((box) => (
              <div
                key={box.key}
                tabIndex={0}
                role="region"
                aria-label={box.label}
                className="relative rounded-2xl shadow-xl p-6 flex flex-col items-start justify-between min-h-[220px] cursor-pointer group transition-all duration-300 hover:scale-105 focus:scale-105 outline-none overflow-hidden"
                style={{ background: box.gradient }}
              >
                {/* Background pattern overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                
                {/* Icon with background */}
                <div 
                  className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: box.iconBg }}
                >
                  <span className="text-2xl" aria-hidden="true">{box.icon}</span>
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col justify-between">
                  <span className="text-lg font-semibold mb-3 text-white drop-shadow-lg leading-tight">{box.label}</span>
                  <span className="text-4xl font-black text-white drop-shadow-lg transition-all duration-500">
                    {loading ? (
                      <span className="animate-pulse text-3xl">Loading...</span>
                    ) : metrics ? (
                      <span className="animate-in slide-in-from-bottom-2 duration-500">
                        {metrics[box.key as keyof Metrics]}
                      </span>
                    ) : (
                      "-"
                    )}
                  </span>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboardForm;
