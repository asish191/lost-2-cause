import axios from "axios";

export const SERVER_NODE_URL = `http://localhost:3001/api/v1`;

// Create Axios instances
const serverRequest = axios.create({
  baseURL: SERVER_NODE_URL,
  withCredentials: true,
});

// Function to get access token (you can customize this logic)
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    try {
      const user =
        JSON.parse(JSON.parse(localStorage.getItem("user") || "{}")).token || "{}";
      console.log(user);
      return user || null;
    } catch {
      return null;
    }
  }
  return null;
};

// Request interceptor to attach token
const attachAccessToken = (config: any) => {
  if (config.skipAuth) return config;

  const token = getAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// Error handler
const handleError = (error: any) =>
  Promise.reject(error?.response?.data || "Something went wrong");

// Attach interceptors
serverRequest.interceptors.request.use(attachAccessToken, handleError);
serverRequest.interceptors.response.use((res) => res, handleError);

// POST
export const postRequest =
  async ({ endpoint, payload, headers = {} }: any) => {
    return await serverRequest.post(endpoint, payload, { headers });
  };

// GET
export const getRequest =
  async ({ endpoint, headers = {} }: any) => {
    return await serverRequest.get(endpoint, {
      headers,
    });
  };

// PUT
export const putRequest =
  async ({ endpoint, payload, headers = {} }: any) => {
    return await serverRequest.put(endpoint, payload, { headers });
  };

// PATCH
export const patchRequest =
  async ({ endpoint, payload, headers = {} }: any) => {
    return await serverRequest.patch(endpoint, payload, { headers });
  };

// DELETE
export const deleteRequest =
  async ({ endpoint, headers = {} }: any) => {
    return await serverRequest.delete(endpoint, { headers });
  };
