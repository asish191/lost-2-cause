'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaUsers, FaLightbulb, FaRecycle, FaShieldAlt } from 'react-icons/fa';

const AboutUsForm: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-indigo-50 text-indigo-700 font-medium rounded-full shadow-lg transition-all duration-300 z-20 border border-indigo-200 hover:shadow-xl"
        aria-label="Go back"
      >
        <FaArrowLeft className="text-lg" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            About Lost2Cause
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Mission Statement Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
              <FaLightbulb className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            Lost2Cause is a smart, scalable, and sustainable lost and found platform designed to 
            streamline the recovery of lost items on university campuses, with potential applications in airports, 
            offices, and beyond. We're transforming the traditional lost and found experience through 
            innovative technology and community-driven solutions.
          </p>
        </div>

        {/* Team Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Team</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Developed by a dedicated team of students at EPITA School of Engineering & Computer Science:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Asish Kumar Ghosh
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Manthan Nileshbhai Bhatt
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Prajwal Pandu Ranga Reddy
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Umair Saeed
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-4 italic">
              Under the guidance of Prof. Thomas Broussard
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
                <FaRecycle className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Sustainability</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our platform addresses the inefficiencies of traditional lost and found systems, 
              which typically recover only 50%-70% of lost items. Unclaimed items are repurposed 
              after 30 days, either donated to local charities or reused in communal spaces, 
              reducing waste by up to 70% and aligning with smart campus initiatives.
            </p>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Technology & Features</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Architecture</h3>
              <p className="text-gray-700 leading-relaxed">
                Microservices architecture powered by MongoDB, NodeJS, and a React-based frontend with NextJS, 
                ensuring scalability and a user-friendly experience.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Security</h3>
              <p className="text-gray-700 leading-relaxed">
                Secure authentication via OAuth 2.0 and AES-256 encryption for data integrity, 
                with automated item tracking and rule-based matching algorithms.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg leading-relaxed opacity-95">
            We aim to create a transparent, efficient, and socially conscious system that not only 
            helps users recover their belongings but also benefits the community. Lost2Cause is our 
            commitment to making asset recovery simple, secure, and sustainable. 
            <span className="block mt-4 font-semibold">
              Join us in transforming the lost and found experience!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsForm;
