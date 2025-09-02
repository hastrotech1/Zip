// This file handles authentication and token management for the application.

// import { profile } from "console";

// It includes methods for storing tokens, making API calls with token refresh logic, and handling logout
interface RefreshTokenResponse {
  accessToken: string;
}

class Authenticate {
  private baseUrl = "https://ziplugs.geniusexcel.tech";

  storeTokens = (
    accessToken: string,
    refreshToken: string,
    user_id: string,
    driver_id: string | null,
    family_name: string,
    name: string,
    delivery_id: string,
    email: string,
    profile_image: string | null
  ): void => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("first_name", family_name);
    localStorage.setItem("delivery_id", delivery_id);
    localStorage.setItem("user_name", name);
    localStorage.setItem("profile_image", profile_image || "");
    if (email) localStorage.setItem("user_mail", email);

    if (driver_id) localStorage.setItem("driver_id", driver_id);
  };

  apiCall = async <T>(
    url: string,
    options: RequestInit,
    retryCount = 1
  ): Promise<Response> => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // If unauthorized and we can retry
      if (response.status === 401 && retryCount > 0) {
        const newAccessToken = await this.refreshAccessToken();
        if (newAccessToken) {
          // Retry the original request with new token
          return this.apiCall<T>(url, options, retryCount - 1);
        }
      }

      // Return the raw response instead of parsing JSON
      return response;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  refreshAccessToken = async (): Promise<string | undefined> => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const response = await fetch(`${this.baseUrl}/api/refresh-token`, {
        // Use full URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = (await response.json()) as RefreshTokenResponse;
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      } else {
        this.logout();
        return undefined;
      }
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      this.logout();
      return undefined;
    }
  };

  logout = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_id");
    localStorage.removeItem("driver_id");
    localStorage.removeItem("user_mail");
    localStorage.removeItem("first_name");
    localStorage.removeItem("user_name");
    // Redirect to login page
    window.location.href = "/login";
  };

  driverLogout = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_id");
    localStorage.removeItem("driver_id");
    localStorage.removeItem("user_mail");
    localStorage.removeItem("first_name");
    window.location.href = "/driver-login";
  };
}

const auth = new Authenticate();
export default auth;
