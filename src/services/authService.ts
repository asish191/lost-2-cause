import { API_BASE_URL } from "@/constants/api";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/register`,
  USER: `${API_BASE_URL}/user/profile`,
  LOGOUT: `${API_BASE_URL}/auth/logout`
};

export interface RegisterPayload {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
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

export interface RegisterPayload {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  message: string;
  body: {
    user: {
      email: string;
      token: string;
    }
  }
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  // Format the name field by combining first_name and last_name with a single space
  const formattedName = `${payload.first_name.trim()} ${payload.last_name.trim()}`.trim();
  const formattedPayload = {
    email: payload.email,
    name: formattedName,
    password: payload.password
  };

  try {
    console.log("[Register] Attempting to register with payload:", formattedPayload);

    const response = await fetch(API_ENDPOINTS.SIGNUP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedPayload),
    });

    console.log("[Register] Response status:", response.status);
    console.log("[Register] Response headers:", response.headers);

    if (response.status !== 201) {
      const text = await response.text();
      console.error("[Register] Response text:", text);
      throw new Error(`Registration failed with status ${response.status}: ${text}`);
    }

    const data = await response.json();
    console.log("[Register] Success data:", data);
    return {
      statusCode: response.status,
      ...data
    };
  } catch (err) {
    console.error("[Register] Error:", err);
    const errorMessage = err instanceof Error ? err.message : 'Registration failed';
    throw new Error(errorMessage);
  }
}

export interface LogoutResponse {
  message: string;
}

export async function logout(token: string): Promise<LogoutResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.LOGOUT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      throw new Error(`Logout failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("[Logout] Error:", err);
    throw new Error("Logout failed");
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    console.log("[Login] Attempting to login with email:", email);
    console.log("[Login] Endpoint:", API_ENDPOINTS.SIGNUP);

    const response = await fetch(API_ENDPOINTS.SIGNUP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("[Login] Response status:", response.status);
    console.log("[Login] Response headers:", response.headers);

    if (response.status !== 200) {
      try {
        const errorData = await response.json();
        console.error("[Login] Error data:", errorData);
        throw new Error(errorData.message || `Login failed with status ${response.status}`);
      } catch {
        const text = await response.text();
        console.error("[Login] Response text:", text);
        throw new Error(`Login failed with status ${response.status}: ${text}`);
      }
    }

    const data = await response.json();
    console.log("[Login] Success data:", data);
    return data;
  } catch (err) {
    console.error("[Login] Error:", err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    throw new Error(`Login failed: ${errorMessage}`);
  }
}
