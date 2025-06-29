"use client";

import { COLORS } from '@/constants/colors';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface ItemCardProps {
  title: string;
  description: string;
  status: 'found' | 'lost' | 'claimed' | 'resolved';
  tags: string[];
  location?: string;
  date?: string;
  onClaim?: () => void;
  onReport?: () => void;
}

export default function ItemCard({
  title,
  description,
  status,
  tags,
  location,
  date,
  onClaim,
  onReport,
}: ItemCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'found':
        return COLORS.success;
      case 'claimed':
        return COLORS.secondary;
      case 'resolved':
        return COLORS.accent;
      default:
        return COLORS.primary;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with status */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'found'
              ? 'bg-green-100 text-green-800'
              : status === 'claimed'
              ? 'bg-purple-100 text-purple-800'
              : status === 'resolved'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-pink-100 text-pink-800'
          }`}>
            {status.toUpperCase()}
          </span>
        </div>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>

      {/* Tags and metadata */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          {location && <span>Location: {location}</span>}
          {date && <span>Date: {date}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 flex justify-end gap-4">
        {onReport && (
          <button
            onClick={onReport}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            Report
          </button>
        )}
        {onClaim && (
          <button
            onClick={onClaim}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            Claim
          </button>
        )}
      </div>
    </div>
  );
}
