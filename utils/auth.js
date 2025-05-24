import { parse } from "cookie";

export function getAuthToken(req) {
  const cookies = parse(req.headers.cookie || "");
  
  const authToken = cookies.auth_token;

  if (!authToken) return null;

  try {
    return JSON.parse(authToken);
  } catch (error) {
    console.error('Error parsing auth_token:', error);
    return null;
  }
}