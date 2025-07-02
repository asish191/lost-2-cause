// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Item Types
export interface Item {
  id: string;
  title: string;
  description: string;
  type: 'lost' | 'found';
  location: string;
  image: string | undefined;
  resolved: boolean;
}

// Utility type for form values
export type ItemType = 'lost' | 'found';

// Form Types
export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  passwordError: string;
}

// Layout Types
export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
