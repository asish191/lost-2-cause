"use client";

import { useState } from 'react';
import { COLORS } from '@/constants/colors';

interface TextareaProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
  rows?: number;
}

export default function Textarea({
  label,
  value,
  onChange,
  required = false,
  error,
  className = '',
  rows = 4,
}: TextareaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={handleChange}
        required={required}
        rows={rows}
        className={`
          w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-lg 
          focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 
          transition-all duration-200 resize-none
          ${error ? 'border-red-500 focus:border-red-500' : ''}
        `}
        placeholder={label}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
