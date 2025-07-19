'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const LearnMore: React.FC = () => {
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
      <div className="max-w-4xl w-full space-y-6">
        {/* Header Section */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-indigo-100">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-800 font-sans drop-shadow-lg tracking-tight">Learn More About Lost2Cause</h1>
        </div>

        {/* Purpose Section - Blue theme */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 font-sans border-b-2 border-blue-300 pb-2">Purpose and Problem Addressed</h2>
          <p className="text-lg text-gray-700 font-medium leading-relaxed font-sans">
            Traditional lost and found systems in large institutions, such as universities, rely on manual processes like paper records and emails, resulting in low recovery rates (20–30%) and significant administrative burden (up to 10 hours weekly). Over 60% of unclaimed items are discarded, contributing to waste (Siok Yee Tan, 2023; Meihua Zhou, 2024). Lost2Cause is a smart, automated platform designed to enhance item recovery, reduce administrative workload, and promote sustainable disposal, initially for university campuses with scalability to airports and offices.
          </p>
        </div>

        {/* What is Lost2Cause Section - Purple theme */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 border border-purple-200">
          <h2 className="text-2xl font-bold mb-4 text-purple-800 font-sans border-b-2 border-purple-300 pb-2">What is Lost2Cause?</h2>
          <p className="text-lg text-gray-700 font-medium leading-relaxed font-sans">
            Developed by Asish Kumar Ghosh, Manthan Nileshbhai Bhatt, Prajwal Pandu Ranga Reddy, and Umair Saeed at EPITA School of Engineering & Computer Science under Prof. Thomas Broussard's guidance, Lost2Cause leverages modern technology to address inefficiencies in lost and found systems. Our platform uses a microservices architecture with MongoDB, NodeJS, and a NextJS/React frontend to deliver a secure, scalable, and user-friendly solution.
          </p>
        </div>

        {/* How It Works Section - Green theme */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 border border-green-200">
          <h2 className="text-2xl font-bold mb-4 text-green-800 font-sans border-b-2 border-green-300 pb-2">How It Works</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 font-sans text-lg">
            <li className="bg-white/60 p-3 rounded-lg border-l-4 border-green-400">
              <strong className="text-green-700">Item Reporting:</strong> Users submit item details (description, tags, location, optional photos) via a web-based ItemForm, stored securely in a MongoDB database.
            </li>
            <li className="bg-white/60 p-3 rounded-lg border-l-4 border-green-400">
              <strong className="text-green-700">Rule-Based Matching:</strong> Algorithms utilize tag-based filtering, TF-IDF for text similarity, and time/location heuristics to achieve up to 80% matching accuracy. Future iterations will incorporate CNN-based image matching for enhanced precision.
            </li>
            <li className="bg-white/60 p-3 rounded-lg border-l-4 border-green-400">
              <strong className="text-green-700">Secure Claiming:</strong> Claims are processed via OAuth 2.0 authentication with university credentials, with admin verification using digital proof (e.g., receipts). AES-256 encryption ensures data security.
            </li>
            <li className="bg-white/60 p-3 rounded-lg border-l-4 border-green-400">
              <strong className="text-green-700">Unclaimed Item Disposal:</strong> After 30 days, unclaimed items are listed on an internal marketplace or donated to charities like Linkee or Solidarity COP1. Community voting enables repurposing (e.g., chargers in libraries), reducing waste by 70%.
            </li>
            <li className="bg-white/60 p-3 rounded-lg border-l-4 border-green-400">
              <strong className="text-green-700">Communication:</strong> A chat feature facilitates user-admin interaction for queries and support.
            </li>
          </ol>
        </div>

        {/* Technical Foundation Section - Orange theme */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-xl p-8 border border-orange-200">
          <h2 className="text-2xl font-bold mb-4 text-orange-800 font-sans border-b-2 border-orange-300 pb-2">Technical Foundation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="list-disc list-inside space-y-3 text-gray-700 font-sans text-lg">
              <li className="bg-white/60 p-3 rounded-lg">
                <strong className="text-orange-700">Database:</strong> MongoDB with structured tables (Items, Users, Claims, Transactions) supports complex queries with &lt;100ms response times.
              </li>
              <li className="bg-white/60 p-3 rounded-lg">
                <strong className="text-orange-700">Backend:</strong> NodeJS microservices (Authentication, Item Management, Matching/Donation) are containerized with Docker and Kubernetes, handling 10,000 API requests per minute with ~50ms latency.
              </li>
            </ul>
            <ul className="list-disc list-inside space-y-3 text-gray-700 font-sans text-lg">
              <li className="bg-white/60 p-3 rounded-lg">
                <strong className="text-orange-700">Frontend:</strong> NextJS with React Components, styled with Tailwind CSS, ensures accessibility (WCAG 2.1-compliant) and rapid item reporting (&lt;1 minute).
              </li>
              <li className="bg-white/60 p-3 rounded-lg">
                <strong className="text-orange-700">Security:</strong> OAuth 2.0 for single sign-on, AES-256 encryption for data in transit and at rest, and GDPR-compliant practices with audit trails for accountability.
              </li>
            </ul>
          </div>
        </div>

        {/* Key Benefits Section - Teal theme */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl shadow-xl p-8 border border-teal-200">
          <h2 className="text-2xl font-bold mb-4 text-teal-800 font-sans border-b-2 border-teal-300 pb-2">Key Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/60 p-4 rounded-lg text-center">
              <h3 className="font-bold text-teal-700 mb-2">Improved Recovery</h3>
              <p className="text-sm">Targets 60–70% item recovery, significantly outperforming manual systems.</p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg text-center">
              <h3 className="font-bold text-teal-700 mb-2">Efficiency</h3>
              <p className="text-sm">Reduces administrative workload by 50% (from 10 to 5 hours weekly).</p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg text-center">
              <h3 className="font-bold text-teal-700 mb-2">Sustainability</h3>
              <p className="text-sm">Repurposes or donates 70% of unclaimed items, aligning with smart campus initiatives.</p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg text-center">
              <h3 className="font-bold text-teal-700 mb-2">User Engagement</h3>
              <p className="text-sm">Aims for 60% student participation with a user satisfaction score &gt;4/5.</p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg text-center">
              <h3 className="font-bold text-teal-700 mb-2">Scalability</h3>
              <p className="text-sm">Supports thousands of concurrent users, with potential expansion to larger venues.</p>
            </div>
          </div>
        </div>

        {/* Impact and Vision Section - Indigo theme */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-indigo-200">
          <h2 className="text-2xl font-bold mb-4 text-indigo-800 font-sans border-b-2 border-indigo-300 pb-2">Impact and Vision</h2>
          <p className="text-lg text-gray-700 font-medium leading-relaxed font-sans">
            Lost2Cause enhances asset recovery while fostering sustainability and community engagement. By integrating with charities and enabling communal reuse, it reduces waste and supports smart campus goals. Beta testing at EPITA will validate scalability and user experience, targeting 90% satisfaction. Future enhancements include CNN-based image matching for 90% accuracy and IoT integration for tracking high-value items. We aim to redefine lost and found systems across universities, airports, and offices, delivering a transparent, efficient, and socially responsible solution.
          </p>
        </div>

        {/* Join Us Section - Rose theme */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl shadow-xl p-8 border border-rose-200">
          <h2 className="text-2xl font-bold mb-4 text-rose-800 font-sans border-b-2 border-rose-300 pb-2">Join Us</h2>
          <p className="text-lg text-gray-700 font-medium leading-relaxed font-sans">
            Lost2Cause invites students, administrators, and organizations to experience a modern approach to lost and found management. Engage with our platform, provide feedback, or explore collaboration opportunities with charities and institutions. Contact us to learn how Lost2Cause can transform asset recovery at your organization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
