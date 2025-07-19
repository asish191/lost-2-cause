'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaBoxOpen, FaUserShield, FaTachometerAlt, FaComments, FaEnvelopeOpenText, FaInfoCircle, FaBell, FaMobileAlt, FaSearch, FaStar, FaMapMarkedAlt, FaGlobe } from 'react-icons/fa';

const currentServices = [
  {
    title: 'Lost & Found Item Management',
    description: 'Report lost or found items, browse available items, and claim items. Admins can manage all items.',
    icon: <FaBoxOpen className="text-indigo-500 text-4xl md:text-5xl" />,
  },
  {
    title: 'User Authentication',
    description: 'Register, log in, and access personalized features. Admins and regular users have different access.',
    icon: <FaUserShield className="text-green-500 text-4xl md:text-5xl" />,
  },
  {
    title: 'Dashboard',
    description: 'Personalized dashboard to view and manage your items and claims.',
    icon: <FaTachometerAlt className="text-blue-500 text-4xl md:text-5xl" />,
  },
  {
    title: 'Communication Hub',
    description: 'Discuss items, coordinate returns, and ask questions with other users.',
    icon: <FaComments className="text-pink-500 text-4xl md:text-5xl" />,
  },
  {
    title: 'Contact and Support',
    description: 'Reach out for help or inquiries through the contact page.',
    icon: <FaEnvelopeOpenText className="text-yellow-500 text-4xl md:text-5xl" />,
  },
  {
    title: 'About Us',
    description: 'Learn about the platform and its mission.',
    icon: <FaInfoCircle className="text-purple-500 text-4xl md:text-5xl" />,
  },
];

const futureServices = [
  {
    title: 'Real-time Notifications',
    description: 'Get instant updates on item status, claims, and messages.',
    icon: <FaBell className="text-indigo-400 text-4xl md:text-5xl" />,
  },
  {
    title: 'Mobile App Integration',
    description: 'Access Lost2Cause on your mobile device.',
    icon: <FaMobileAlt className="text-green-400 text-4xl md:text-5xl" />,
  },
  {
    title: 'Advanced Search & Filters',
    description: 'Find items by location, date, or category.',
    icon: <FaSearch className="text-blue-400 text-4xl md:text-5xl" />,
  },
  {
    title: 'User Reputation System',
    description: 'Build trust with a rating system for finders and claimers.',
    icon: <FaStar className="text-yellow-400 text-4xl md:text-5xl" />,
  },
  {
    title: 'Lost & Found Map View',
    description: 'Visualize lost and found items on a map.',
    icon: <FaMapMarkedAlt className="text-pink-400 text-4xl md:text-5xl" />,
  },
  {
    title: 'Multi-language Support',
    description: 'Use the platform in your preferred language.',
    icon: <FaGlobe className="text-purple-400 text-4xl md:text-5xl" />,
  },
];

const ServicesForm: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 py-14 px-2 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg shadow transition-colors z-20 border border-indigo-200"
        aria-label="Go back"
      >
        <FaArrowLeft className="text-xl" />
        <span className="hidden sm:inline">Back</span>
      </button>
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-800 font-sans drop-shadow-lg tracking-tight">Our Services</h1>
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b-2 border-indigo-200 pb-2 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-indigo-400 rounded-full mr-2"></span>
            Currently Available
          </h2>
          <ul className="grid md:grid-cols-2 gap-8">
            {currentServices.map((service, idx) => (
              <li key={idx} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-8 flex items-start gap-6 group border border-indigo-100 hover:border-indigo-300">
                <div className="mt-1 group-hover:scale-110 transition-transform">{service.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-1 font-sans">{service.title}</h3>
                  <p className="text-base text-gray-700 font-medium">{service.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6 flex items-center justify-center">
          <span className="h-1 w-28 bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 rounded-full"></span>
          <span className="mx-5 text-xl text-indigo-400 font-bold tracking-widest">•••</span>
          <span className="h-1 w-28 bg-gradient-to-l from-indigo-400 via-blue-400 to-purple-400 rounded-full"></span>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b-2 border-indigo-200 pb-2 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-indigo-400 rounded-full mr-2"></span>
            Coming Soon
          </h2>
          <ul className="grid md:grid-cols-2 gap-8">
            {futureServices.map((service, idx) => (
              <li key={idx} className="bg-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 flex items-start gap-6 opacity-95 border border-indigo-100 hover:border-indigo-300 relative">
                <div className="mt-1 group-hover:scale-110 transition-transform">{service.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-700 mb-1 font-sans flex items-center gap-2">
                    {service.title}
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-gradient-to-r from-indigo-300 to-purple-200 text-indigo-900 shadow-sm">Coming Soon</span>
                  </h3>
                  <p className="text-base text-gray-600 font-medium">{service.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServicesForm;
