const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Network error or invalid response",
        }));
        throw new Error(
          errorData.error || errorData.message || "Request failed",
        );
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // Auth Methods
  async register(userData) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.request("/api/auth/me");
  }

  // Profile Update Method
  async updateProfile(profileData) {
    return this.request("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  }
}

export const apiClient = new ApiClient();
