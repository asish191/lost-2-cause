"use client";

import { useState } from 'react';
import AddItemForm from '@/components/forms/AddItemForm';
import ItemCard from '@/components/common/ItemCard';
import { COLORS } from '@/constants/colors';

export default function ItemsPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Items</h1>
          <p className="mt-2 text-gray-600">Track and manage lost and found items in your community.</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <AddItemForm onSubmit={handleAddItem} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              title={item.title}
              description={item.description}
              status={item.status}
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
  );
}
