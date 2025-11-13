import axios from "../config/axios";

export const currentUser = async (token) =>
  await axios.post(
    "/current-user",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const currentAdmin = async (token) =>
  await axios.post(
    "/current-admin",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const currentSuperAdmin = async (token) =>
  await axios.post(
    "/current-superadmin",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const register = async (data) =>
  await axios.post("/register", data);

export const login = async (data) =>
  await axios.post("/login", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
