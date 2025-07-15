export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Auth Endpoints
export const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;
export const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register`;
export const REFRESH_TOKEN_ENDPOINT = `${API_BASE_URL}/auth/refresh-token`;

// User Endpoints
export const USER_PROFILE_ENDPOINT = `${API_BASE_URL}/user/profile`;
export const USER_UPDATE_ENDPOINT = `${API_BASE_URL}/user/update`;

// Communication Hub Endpoints
export const COMMUNICATION_HUB_ENDPOINT = `${API_BASE_URL}/communication-hub`;
export const COMMUNICATION_HUB_MESSAGES_ENDPOINT = `${COMMUNICATION_HUB_ENDPOINT}/messages`;
export const COMMUNICATION_HUB_SETTINGS_ENDPOINT = `${COMMUNICATION_HUB_ENDPOINT}/settings`;
