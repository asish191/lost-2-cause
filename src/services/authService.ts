import { REGISTER_ENDPOINT } from "@/constants/endpoints";


export interface RegisterPayload {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
}

export interface RegisterResponse {
  message: string;
  user?: {
    email: string;
    id: number;
  };
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  console.log("Register payload:", payload); 
  console.log("Register endpoint:", REGISTER_ENDPOINT); 
  try {
    const response = await fetch(REGISTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("Raw response:", response); 
    console.log("Response status:", response.status); 
    debugger;
    if (!response.ok) {
      let errorMsg = "Registration failed";
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
        console.error("API error data:", errorData); 
      } catch (err) {
        console.error("Error parsing error response:", err); 
      }
      throw new Error(errorMsg);
    }
    const data = await response.json();
    console.log("Register success data:", data); 
    return data;
  } catch (err) {
    console.error("Register fetch error:", err); 
    throw err;
  }
}
