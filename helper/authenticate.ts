// This file handles authentication and token management for the application.

// import { profile } from "console";

// It includes methods for storing tokens, making API calls with token refresh logic, and handling logout
// interface RefreshTokenResponse {
//   accessToken: string;
// }

// class Authenticate {
//   private baseUrl = "https://ziplugs.geniusexcel.tech";

//   storeTokens = (
//     accessToken: string,
//     refreshToken: string,
//     user_id: string,
//     driver_id: string | null,
//     family_name: string,
//     name: string,
//     delivery_id: string,
//     email: string,
//     profile_image: string | null
//   ): void => {
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);
//     localStorage.setItem("user_id", user_id);
//     localStorage.setItem("first_name", family_name);
//     localStorage.setItem("delivery_id", delivery_id);
//     localStorage.setItem("user_name", name);
//     localStorage.setItem("profile_image", profile_image || "");
//     if (email) localStorage.setItem("user_mail", email);

//     if (driver_id) localStorage.setItem("driver_id", driver_id);
//   };

//   apiCall = async <T>(
//     url: string,
//     options: RequestInit,
//     retryCount = 1
//   ): Promise<Response> => {
//     const accessToken = localStorage.getItem("accessToken");

//     try {
//       const response = await fetch(url, {
//         ...options,
//         headers: {
//           ...options.headers,
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       // If unauthorized and we can retry
//       if (response.status === 401 && retryCount > 0) {
//         const newAccessToken = await this.refreshAccessToken();
//         if (newAccessToken) {
//           // Retry the original request with new token
//           return this.apiCall<T>(url, options, retryCount - 1);
//         }
//       }

//       // Return the raw response instead of parsing JSON
//       return response;
//     } catch (error) {
//       console.error("API call failed:", error);
//       throw error;
//     }
//   };

//   refreshAccessToken = async (): Promise<string | undefined> => {
//     const refreshToken = localStorage.getItem("refreshToken");

//     try {
//       const response = await fetch(`${this.baseUrl}/api/refresh-token`, {
//         // Use full URL
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (response.ok) {
//         const data = (await response.json()) as RefreshTokenResponse;
//         localStorage.setItem("accessToken", data.accessToken);
//         return data.accessToken;
//       } else {
//         this.logout();
//         return undefined;
//       }
//     } catch (error) {
//       console.error("Failed to refresh access token:", error);
//       this.logout();
//       return undefined;
//     }
//   };

//   logout = (): void => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user_id");
//     localStorage.removeItem("driver_id");
//     localStorage.removeItem("user_mail");
//     localStorage.removeItem("first_name");
//     localStorage.removeItem("user_name");
//     // Redirect to login page
//     window.location.href = "/login";
//   };

//   driverLogout = (): void => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user_id");
//     localStorage.removeItem("driver_id");
//     localStorage.removeItem("user_mail");
//     localStorage.removeItem("first_name");
//     window.location.href = "/driver-login";
//   };
// }

// const auth = new Authenticate();
// export default auth;

// Fixed authenticate.ts - Centralized authentication and token management

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface ApiResponse<T> {
  message: string;
  status: 'success' | 'error';
  data?: T;
  code?: string;
}

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class Authenticate {
  private static instance: Authenticate;
  private readonly baseUrl = "https://ziplugs.geniusexcel.tech";
  private refreshPromise: Promise<string | null> | null = null;

  // Singleton pattern for consistent token management
  static getInstance(): Authenticate {
    if (!Authenticate.instance) {
      Authenticate.instance = new Authenticate();
    }
    return Authenticate.instance;
  }

  // Standardized token storage with consistent naming
  storeTokens = (
    accessToken: string,
    refreshToken: string,
    userId: string,
    driverId: string | null = null,
    firstName: string = '',
    lastName: string = '',
    deliveryId: string = '',
    email: string = '',
    profileImage: string | null = null
  ): void => {
    try {
      // Store with consistent naming
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("first_name", firstName);
      localStorage.setItem("last_name", lastName);
      localStorage.setItem("user_name", `${firstName} ${lastName}`.trim());
      localStorage.setItem("delivery_id", deliveryId);
      localStorage.setItem("profile_image", profileImage || "");
      
      if (email) {
        localStorage.setItem("user_mail", email);
      }
      
      if (driverId) {
        localStorage.setItem("driver_id", driverId);
      }

      // Store token timestamp for expiration tracking
      localStorage.setItem("token_timestamp", Date.now().toString());
      
      console.log("Tokens stored successfully");
    } catch (error) {
      console.error("Failed to store tokens:", error);
      throw new APIError("Failed to store authentication tokens", 500);
    }
  };

  // Get access token with validation
  getAccessToken = (): string | null => {
    try {
      return localStorage.getItem("accessToken");
    } catch (error) {
      console.error("Failed to retrieve access token:", error);
      return null;
    }
  };

  // Check if user is authenticated
  isAuthenticated = (): boolean => {
    const token = this.getAccessToken();
    return !!token && token.trim().length > 0;
  };

  // Enhanced API call with proper error handling and retry logic
  apiCall = async <T = any>(
    url: string,
    options: RequestInit,
    retryCount = 1
  ): Promise<T> => {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      throw new APIError("No access token available", 401, "NO_TOKEN");
    }

    try {
      // Ensure URL is absolute
      const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(15000),
      });

      // Handle authentication errors with retry
      if (response.status === 401 && retryCount > 0) {
        console.log("Access token expired, attempting refresh...");
        
        const newAccessToken = await this.refreshAccessToken();
        if (newAccessToken) {
          console.log("Token refreshed, retrying request...");
          return this.apiCall<T>(url, options, retryCount - 1);
        }
      }

      // Parse response
      let data: ApiResponse<T>;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        data = {
          message: text || 'Request completed',
          status: response.ok ? 'success' : 'error',
          data: text as any
        };
      }

      if (!response.ok) {
        throw new APIError(
          data.message || `Request failed with status ${response.status}`,
          response.status,
          data.code,
          data
        );
      }

      return data.data || data as T;
    } catch (error) {
      console.error("API call failed:", error);
      
      if (error instanceof APIError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new APIError(
          "Network connection failed. Please check your internet connection.",
          0,
          "NETWORK_ERROR"
        );
      }
      
      // Handle timeout errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new APIError(
          "Request timed out. Please try again.",
          0,
          "TIMEOUT_ERROR"
        );
      }
      
      throw new APIError(
        "An unexpected error occurred",
        500,
        "UNKNOWN_ERROR",
        error
      );
    }
  };

  // Improved token refresh with proper error handling
  refreshAccessToken = async (): Promise<string | null> => {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._doRefreshToken();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  };

  private _doRefreshToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.error("No refresh token available");
      this.logout();
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Refresh failed with status: ${response.status}`);
      }

      const data: RefreshTokenResponse = await response.json();
      
      if (!data.accessToken) {
        throw new Error("No access token in refresh response");
      }

      // Update stored access token
      localStorage.setItem("accessToken", data.accessToken);
      
      // Update refresh token if provided
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      
      // Update timestamp
      localStorage.setItem("token_timestamp", Date.now().toString());
      
      console.log("Access token refreshed successfully");
      return data.accessToken;
      
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      
      // If refresh fails, user needs to re-authenticate
      this.logout();
      return null;
    }
  };

  // Clean logout with proper cleanup
  logout = (): void => {
    try {
      // Clear all authentication-related data
      const keysToRemove = [
        "accessToken",
        "refreshToken", 
        "user_id",
        "driver_id",
        "user_mail",
        "first_name",
        "last_name",
        "user_name",
        "delivery_id",
        "profile_image",
        "token_timestamp"
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log("User logged out successfully");
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Force redirect even if cleanup fails
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }
  };

  // Driver-specific logout
  driverLogout = (): void => {
    try {
      // Clear all authentication-related data
      const keysToRemove = [
        "accessToken",
        "refreshToken",
        "user_id", 
        "driver_id",
        "user_mail",
        "first_name",
        "last_name",
        "user_name",
        "delivery_id",
        "profile_image",
        "token_timestamp",
        "driver_info_id"
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log("Driver logged out successfully");
      
      // Redirect to driver login
      if (typeof window !== 'undefined') {
        window.location.href = "/driver-login";
      }
    } catch (error) {
      console.error("Error during driver logout:", error);
      // Force redirect even if cleanup fails
      if (typeof window !== 'undefined') {
        window.location.href = "/driver-login";
      }
    }
  };

  // Get user info from localStorage
  getUserInfo = () => {
    try {
      return {
        userId: localStorage.getItem("user_id"),
        driverId: localStorage.getItem("driver_id"),
        email: localStorage.getItem("user_mail"),
        firstName: localStorage.getItem("first_name"),
        lastName: localStorage.getItem("last_name"),
        userName: localStorage.getItem("user_name"),
        profileImage: localStorage.getItem("profile_image"),
        isAuthenticated: this.isAuthenticated()
      };
    } catch (error) {
      console.error("Failed to get user info:", error);
      return {
        userId: null,
        driverId: null,
        email: null,
        firstName: null,
        lastName: null,
        userName: null,
        profileImage: null,
        isAuthenticated: false
      };
    }
  };
}

// Export singleton instance
const auth = Authenticate.getInstance();
export default auth;
export { APIError };
export type { ApiResponse };