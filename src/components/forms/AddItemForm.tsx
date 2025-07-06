"use client";

import { useState } from 'react';
import { COLORS } from '@/constants/colors';
import Input from './inputs/Input';
import Textarea from './inputs/Textarea';

interface ItemFormData {
  title: string;
  description: string;
  type: string;
  location: string;
  date: string;
  tags: string[];
}

interface AddItemFormProps {
  onSubmit: (data: ItemFormData) => void;
  onClear?: () => void;
}

export default function AddItemForm({ onSubmit, onClear }: AddItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    title: '',
    description: '',
    type: 'lost',
    location: '',
    date: '',
    tags: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Clear the form after submission
    setFormData({
      title: '',
      description: '',
      type: 'lost',
      location: '',
      date: '',
      tags: []
    });
    if (onClear) {
      onClear();
    }
  };

  const handleChange = (field: keyof ItemFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value;
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Title"
          type="text"
          value={formData.title}
          onChange={(value) => handleChange('title', value)}
          required
          className="w-full"
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(value) => handleChange('description', value)}
          required
          rows={4}
          className="w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-lg 
                  focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 
                  transition-all duration-200 cursor-pointer"
              >
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-lg 
                  focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 
                  transition-all duration-200"
                placeholder="Location"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
                className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-lg 
                  focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 
                  transition-all duration-200 text-center"
                placeholder="Date"
              />
            </div>

            <div className="relative">
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-purple-400 hover:text-purple-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Tag</label>
                <input
                  type="text"
                  value={''}
                  onChange={handleTagChange}
                  className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-lg 
                    focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 
                    transition-all duration-200"
                  placeholder="Add Tag"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            Submit Item
          </button>
        </div>
      </div>
    </form>
  );
}
