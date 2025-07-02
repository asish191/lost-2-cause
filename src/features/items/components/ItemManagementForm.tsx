"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";

import { FaPlus, FaCheck, FaTimes, FaPaperclip } from "react-icons/fa";
import { COLORS } from "@/constants/colors";

interface Item {
  id: string;
  title: string;
  description: string;
  type: 'lost' | 'found';
  location: string;
  image?: string; // base64 url
  resolved: boolean;
}

export default function ItemManagementForm() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<'lost' | 'found'>("found");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddItem = () => {
    if (!title.trim()) {
      setError("Item title is required");
      return;
    }
    setError(null);
    const newItem: Item = {
      id: Date.now().toString(),
      title,
      description,
      type,
      location,
      image,
      resolved: false,
    };
    setItems((prev) => [newItem, ...prev]);
    // reset the form
    setTitle("");
    setDescription("");
    setLocation("");
    setType('found');
    setImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleResolved = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, resolved: !item.resolved } : item
      )
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Upload Form found item */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaPlus /> Found/Lost Item Upload
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Item title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {/* Type Radio Button lost and found */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="lost"
                checked={type === 'lost'}
                onChange={() => setType('lost')}
              />
              Lost
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="found"
                checked={type === 'found'}
                onChange={() => setType('found')}
              />
              Found
            </label>
          </div>
          {/* Location Text field  */}
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label htmlFor="file-input" className="cursor-pointer text-primary hover:text-secondary flex items-center gap-2 font-medium">
              <FaPaperclip /> {image ? 'Change image' : 'Attach image'}
            </label>
          </div>
          {image && (
            <Image
              src={image}
              alt="Preview"
              width={200}
              height={200}
              className="object-cover rounded-md"
            />
          )}
          
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={handleAddItem}
          >
            Upload Item       
          </button>
        </div>
      </div>

      {/* Items List found item */}
      <div className="bg-white p-6 rounded-lg shadow-md ">
        <h2 className="text-xl font-semibold mb-4">Your Posted Items</h2>
        {items.length === 0 ? (
          <p className="text-gray-600">No items yet.</p>
        ) : (
          <ul className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <li
                key={item.id}
                className="bg-gray-100 rounded-lg p-4 flex gap-4 items-start justify-center"
                style={{
                  border: '2px solid',
                  borderRadius: '10px',
                  borderColor: COLORS.gradientEnd
                }}
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {item.title}
                    {item.resolved && (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <FaCheck /> Resolved
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  <p className="text-sm mt-1 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${item.type === 'lost' ? 'bg-red-600' : 'bg-blue-600'}`}>{item.type}</span>
                    {item.location && (
                      <span className="text-gray-500 text-xs">Location: {item.location}</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => toggleResolved(item.id)}
                  style={{
                    backgroundColor: item.resolved ? COLORS.primary : COLORS.secondary,
                    color: 'white',
                  }}
                  className="shrink-0 px-4 py-2 rounded-md transition-colors py-2"
                >
                  {item.resolved ? (
                    <span className="flex items-center gap-2"><FaTimes /> Unresolve</span>
                  ) : (
                    <span className="flex items-center gap-2"><FaCheck /> Mark Resolved</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
