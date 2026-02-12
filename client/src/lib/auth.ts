import { apiRequest } from "./queryClient";

export async function loginAdmin(password: string): Promise<boolean> {
  try {
    const response = await apiRequest("POST", "/api/auth/admin", { password });
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await apiRequest("POST", "/api/auth/logout", {});
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export async function checkAdminStatus(): Promise<boolean> {
  try {
    const response = await apiRequest("GET", "/api/auth/check", {});
    const data = await response.json();
    return data.isAdmin === true;
  } catch (error) {
    return false;
  }
}
