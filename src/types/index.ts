// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  isAdmin: boolean; // Added for admin/user distinction
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

// Registration Types
export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface RegisterResponse {
  statusCode: number;
  message: string;
  body: {
    user: {
      email: string;
      token: string;
    }
  }
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

export interface LoginResponse {
  statusCode: number;
  message: string;
  body: {
    user: {
      email: string;
      token: string;
    }
  }
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
  statusCode: number;
  message: string;
  body: T;
}
