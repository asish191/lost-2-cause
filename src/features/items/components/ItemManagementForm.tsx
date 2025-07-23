"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { FaPlus, FaCheck, FaTimes, FaPaperclip } from "react-icons/fa";
import { COLORS } from "@/constants/colors";
import { useForm } from '@/hooks/useForm';
import { Item, ItemType } from '@/types';
import useItemsStore from '@/zustand/stores/useItemsStorage';
import { useAuth } from '@/contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

interface ItemManagementFormProps {
  initialItems?: Item[];
}

export default function ItemManagementForm({ initialItems = [] }: ItemManagementFormProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const { user } = useAuth();

  const { values, handleChange, handleBlur, reset } = useForm({
    title: '',
    description: '',
    type: 'found' as ItemType,
    location: '',
    image: undefined,
  });

  const { uploadItem, isLoading } = useItemsStore() as { uploadItem: (data: FormData) => Promise<void>, isLoading: boolean };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create FormData for upload
      const formData = new FormData();
      
      // Check if user is logged in first
      if (!user?.id) {
        toast.error('You must be logged in to upload items');
        return;
      }
      
      // Required fields with defaults
      formData.append('itemName', values.title);
      formData.append('itemDescription', values.description);
      formData.append('status', values.type); // 'found' or 'lost'
      formData.append('floor', values.location); // location as floor
      formData.append('uploaderId', user.id); // userID as uploaderId
      formData.append('uploaderName', `${user.firstName} ${user.lastName}`); // user name as uploaderName
      
      
      // Optional fields
      if (values.image) {
        formData.append('image', values.image);
        console.log('🖼️ [ItemUpload] Image attached:', {
          name: (values.image as File).name,
          size: (values.image as File).size,
          type: (values.image as File).type
        });
      } else {
        console.log('📷 [ItemUpload] No image attached');
      }

      console.log('⬆️ [ItemUpload] Calling uploadItem API...');
      const result = await uploadItem(formData);
      console.log('✅ [ItemUpload] Upload successful:', result);
      
      console.log('🎉 [ItemUpload] Showing success toast');
      toast.success('Item uploaded successfully!');
      
      // Add the new item to local state
      const newItem: Item = {
        id: Date.now().toString(),
        title: values.title,
        description: values.description,
        type: values.type,
        location: values.location,
        image: values.image,
        resolved: false,
      };
      console.log('📝 [ItemUpload] Adding item to local state:', newItem);
      setItems([...items, newItem]);

      console.log('🔄 [ItemUpload] Resetting form');
      reset();
    } catch (error) {
      console.error('❌ [ItemUpload] Upload failed:', error);
      console.error('❌ [ItemUpload] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error('Failed to upload item. Please try again.');
    }
    
    console.log('🏁 [ItemUpload] Form submission completed');
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      e.target.value = ''; // Reset input
      return;
    }

    handleChange('image', file);
    toast.success('Image selected successfully!');
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaPlus /> Found/Lost Item Upload
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Item title"
            value={values.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            placeholder="Description"
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Type Radio Button lost and found */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="lost"
                checked={values.type === 'lost'}
                onChange={() => handleChange('type', 'lost' as ItemType)}
              />
              Lost
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="found"
                checked={values.type === 'found'}
                onChange={() => handleChange('type', 'found' as ItemType)}
              />
              Found
            </label>
          </div>
          {/* Location Text field  */}
          <input
            type="text"
            placeholder="Location"
            value={values.location}
            onChange={(e) => handleChange('location', e.target.value)}
            onBlur={() => handleBlur('location')}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                <FaPaperclip className="mr-2" /> Attach Image
              </span>
            </label>
            {values.image && (
              <span className="text-sm text-green-600">✓ Image selected</span>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white 
                ${isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200`}
            >
              {isLoading ? 'Uploading...' : 'Submit Item'}
            </button>
          </div>
        </form>
      </div>

      {/* Items List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Posted Items</h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items posted yet</p>
        ) : (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <div className="mt-2 space-x-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${item.type === 'found' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.type}
                      </span>
                      {item.location && (
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.resolved && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
