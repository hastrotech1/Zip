// import { create } from "zustand";
// import axios from "axios";

// interface NormalizedDelivery {
//   id: string;
//   customer: {
//     name: string;
//     phone: string;
//     profilePicture: string;
//   };
//   package: {
//     description: string;
//   };
//   pickup: {
//     address: string;
//   };
//   delivery: {
//     address: string;
//   };
//   estimatedTime: string;
//   status: string;
// }

// export interface Driver {
//   id: string;
//   name: string;
//   email: string;
//   phone_number: string;
//   isOnline: boolean;
//   profile_image?: string;
//   rating: number;
//   completedDeliveries: number;
//   vehicle: {
//     type: string;
//     model: string;
//     plateNumber: string;
//   };
//   documents: {
//     id: { verified: boolean };
//     license: { verified: boolean };
//     vehicle: { verified: boolean };
//   };
// }

// interface DriverStore {
//   driver: Driver | null;
//   availableDeliveries: NormalizedDelivery[];
//   myDeliveries: NormalizedDelivery[];
//   currentDelivery: NormalizedDelivery | null;
//   toggleOnlineStatus: () => void;
//   fetchAvailableDeliveries: () => Promise<void>;
//   fetchMyDeliveries: () => Promise<void>;
//   acceptDelivery: (deliveryId: string) => Promise<void>;
//   updateDeliveryStatus: (
//     deliveryId: string,
//     status: "picked_up" | "in_transit" | "delivered"
//   ) => Promise<void>;
//   completeDelivery: (deliveryId: string) => Promise<void>;
//   setCurrentDelivery: (delivery: NormalizedDelivery) => void;
// }

// const normalizeDelivery = (d: any): NormalizedDelivery => ({
//   id: d.id,
//   customer: {
//     name: `${d.shipment_info.customer.first_name} ${d.shipment_info.customer.last_name}`,
//     phone: d.shipment_info.customer.phone_number,
//     profilePicture: d.shipment_info.customer.profile_image,
//   },
//   package: {
//     description: `Order ${d.shipment_info.order_number}`,
//   },
//   pickup: {
//     address: d.shipment_info.pickup_location,
//   },
//   delivery: {
//     address: d.shipment_info.delivery_location,
//   },
//   estimatedTime: new Date(d.shipment_info.created_at).toLocaleString(),
//   status: d.status,
// });

// export const useDriverStore = create<DriverStore>((set, get) => ({
//   driver: {
//     id: "", // placeholder
//     isOnline: true,
//     name: "",
//     email: "",
//     phone_number: "",
//     rating: 0,
//     completedDeliveries: 0,
//     vehicle: {
//       type: "",
//       model: "",
//       plateNumber: "",
//     },
//     documents: {
//       id: { verified: false },
//       license: { verified: false },
//       vehicle: { verified: false },
//     },
//   },
//   availableDeliveries: [],
//   myDeliveries: [],
//   currentDelivery: null,

//   // Store-level toggleOnlineStatus method
//   toggleOnlineStatus: () => {
//     const current = get().driver;
//     if (!current) return;
//     set({
//       driver: {
//         ...current,
//         isOnline: !current.isOnline,
//       },
//     });
//   },

//   fetchAvailableDeliveries: async () => {
//     const token = localStorage.getItem('accessToken');
//     const response = await fetch('https://ziplugs.geniusexcel.tech/api/driver-delivery-management', {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     const result = await response.json();

//     // Filter for pending deliveries only
//     const deliveries = result.data
//       .filter((item: any) => item.status === "pending")
//       .map((item: any) => ({
//         id: item.id,
//         customer: {
//           name: `${item.shipment_info.customer.first_name} ${item.shipment_info.customer.last_name}`,
//           phone: item.shipment_info.customer.phone_number,
//           profilePicture: item.shipment_info.customer.profile_image,
//         },
//         estimatedTime: new Date(item.shipment_info.created_at).toLocaleString(),
//         package: {
//           description: `Order #${item.shipment_info.order_number} - Fee: $${item.shipment_info.estimate_fee}`,
//         },
//         pickup: {
//           address: item.shipment_info.pickup_location,
//         },
//         delivery: {
//           address: item.shipment_info.delivery_location,
//         },
//         status: item.status,
//       }));

//     set({ availableDeliveries: deliveries });
//   },

//   fetchMyDeliveries: async () => {
//     const token = localStorage.getItem("accessToken");
//     const [activeRes, completedRes] = await Promise.all([
//       axios.get("https://ziplugs.geniusexcel.tech/api/driver-delivery-management?status=active", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//       axios.get("https://ziplugs.geniusexcel.tech/api/driver-delivery-management?status=completed", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//     ]);

//     const normalized = [
//       ...activeRes.data.data.map(normalizeDelivery),
//       ...completedRes.data.data.map(normalizeDelivery),
//     ];

//     set({ myDeliveries: normalized });
//   },

//   acceptDelivery: async (deliveryId: string) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       await axios.put(
//         `https://ziplugs.geniusexcel.tech/api/driver-delivery-management/${deliveryId}`,
//         { status: "accepted" },
//         { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//       );
      
//       await get().fetchMyDeliveries();
//     } catch (err) {
//       console.error("Failed to accept delivery", err);
//       throw err;
//     }
//   },

//   updateDeliveryStatus: async (deliveryId: string, status) => {
//     const token = localStorage.getItem("accessToken");
//     await axios.patch(
//       `https://ziplugs.geniusexcel.tech/api/driver-delivery-management/${deliveryId}/status`,
//       { status },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     set({
//       myDeliveries: get().myDeliveries.map((d) =>
//         d.id === deliveryId ? { ...d, status } : d
//       ),
//     });
//   },

//   completeDelivery: async (deliveryId: string) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       await axios.put(
//         `https://ziplugs.geniusexcel.tech/api/driver-delivery-management/${deliveryId}`,
//         { status: "completed" },
//         { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//       );
//       await get().fetchMyDeliveries();
//     } catch (err) {
//       console.error("Failed to complete delivery", err);
//       throw err;
//     }
//   },

//   setCurrentDelivery: (delivery: NormalizedDelivery) => {
//     set({ currentDelivery: delivery });
//   }
// }));

// Fixed driverStore.ts - Improved error handling, loading states, and data consistency

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import auth, { APIError } from "../../../helper/authenticate";

// Enhanced interfaces with proper typing
interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_image: string;
}

interface ShipmentInfo {
  shipment_id: string;
  order_number: string;
  pickup_location: string;
  delivery_location: string;
  receiver_phone: string;
  estimate_fee: number;
  selected_vehicle: string;
  created_at: string;
  customer: Customer;
}

interface DeliveryResponse {
  id: string;
  status: string;
  shipment_info: ShipmentInfo;
}

interface NormalizedDelivery {
  id: string;
  customer: {
    name: string;
    phone: string;
    profilePicture: string;
  };
  package: {
    description: string;
  };
  pickup: {
    address: string;
  };
  delivery: {
    address: string;
  };
  estimatedTime: string;
  status: string;
  rawData?: DeliveryResponse; // Keep original data for debugging
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  isOnline: boolean;
  profile_image?: string;
  rating: number;
  completedDeliveries: number;
  vehicle: {
    type: string;
    model: string;
    plateNumber: string;
  };
  documents: {
    id: { verified: boolean };
    license: { verified: boolean };
    vehicle: { verified: boolean };
  };
}

interface LoadingState {
  availableDeliveries: boolean;
  myDeliveries: boolean;
  statusUpdate: boolean;
  acceptDelivery: boolean;
}

interface ErrorState {
  availableDeliveries: string | null;
  myDeliveries: string | null;
  statusUpdate: string | null;
  acceptDelivery: string | null;
}

interface DriverStore {
  // State
  driver: Driver | null;
  availableDeliveries: NormalizedDelivery[];
  myDeliveries: NormalizedDelivery[];
  currentDelivery: NormalizedDelivery | null;
  loading: LoadingState;
  error: ErrorState;
  lastFetch: {
    availableDeliveries: number | null;
    myDeliveries: number | null;
  };

  // Actions
  setDriver: (driver: Driver) => void;
  toggleOnlineStatus: () => void;
  fetchAvailableDeliveries: () => Promise<void>;
  fetchMyDeliveries: () => Promise<void>;
  acceptDelivery: (deliveryId: string) => Promise<void>;
  updateDeliveryStatus: (
    deliveryId: string,
    status: "picked_up" | "in_transit" | "delivered"
  ) => Promise<void>;
  completeDelivery: (deliveryId: string) => Promise<void>;
  setCurrentDelivery: (delivery: NormalizedDelivery) => void;
  clearError: (key: keyof ErrorState) => void;
  clearAllErrors: () => void;
}

// Data normalization with error handling
const normalizeDelivery = (d: DeliveryResponse): NormalizedDelivery => {
  try {
    const customer = d.shipment_info?.customer;
    if (!customer) {
      throw new Error("Missing customer data");
    }

    return {
      id: d.id,
      customer: {
        name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown Customer',
        phone: customer.phone_number || 'No phone provided',
        profilePicture: customer.profile_image || '',
      },
      package: {
        description: `Order ${d.shipment_info?.order_number || 'N/A'} - ₦${d.shipment_info?.estimate_fee?.toLocaleString() || '0'}`,
      },
      pickup: {
        address: d.shipment_info?.pickup_location || 'Pickup location not specified',
      },
      delivery: {
        address: d.shipment_info?.delivery_location || 'Delivery location not specified',
      },
      estimatedTime: d.shipment_info?.created_at 
        ? new Date(d.shipment_info.created_at).toLocaleString()
        : 'Time not available',
      status: d.status || 'unknown',
      rawData: d, // Keep for debugging
    };
  } catch (error) {
    console.error("Error normalizing delivery data:", error, d);
    // Return a fallback object instead of throwing
    return {
      id: d.id || 'unknown',
      customer: {
        name: 'Unknown Customer',
        phone: 'No phone provided',
        profilePicture: '',
      },
      package: {
        description: 'Order details unavailable',
      },
      pickup: {
        address: 'Pickup location not specified',
      },
      delivery: {
        address: 'Delivery location not specified',
      },
      estimatedTime: 'Time not available',
      status: d.status || 'unknown',
      rawData: d,
    };
  }
};

// Initial states
const initialLoadingState: LoadingState = {
  availableDeliveries: false,
  myDeliveries: false,
  statusUpdate: false,
  acceptDelivery: false,
};

const initialErrorState: ErrorState = {
  availableDeliveries: null,
  myDeliveries: null,
  statusUpdate: null,
  acceptDelivery: null,
};

export const useDriverStore = create<DriverStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    driver: {
      id: "",
      isOnline: true,
      name: "",
      email: "",
      phone_number: "",
      rating: 0,
      completedDeliveries: 0,
      vehicle: {
        type: "",
        model: "",
        plateNumber: "",
      },
      documents: {
        id: { verified: false },
        license: { verified: false },
        vehicle: { verified: false },
      },
    },
    availableDeliveries: [],
    myDeliveries: [],
    currentDelivery: null,
    loading: { ...initialLoadingState },
    error: { ...initialErrorState },
    lastFetch: {
      availableDeliveries: null,
      myDeliveries: null,
    },

    // Actions
    setDriver: (driver: Driver) => {
      set({ driver });
    },

    toggleOnlineStatus: () => {
      const current = get().driver;
      if (!current) return;
      
      set({
        driver: {
          ...current,
          isOnline: !current.isOnline,
        },
      });
    },

    clearError: (key: keyof ErrorState) => {
      set(state => ({
        error: {
          ...state.error,
          [key]: null,
        },
      }));
    },

    clearAllErrors: () => {
      set({ error: { ...initialErrorState } });
    },

    fetchAvailableDeliveries: async () => {
      const { loading } = get();
      
      // Prevent concurrent requests
      if (loading.availableDeliveries) return;

      set(state => ({
        loading: { ...state.loading, availableDeliveries: true },
        error: { ...state.error, availableDeliveries: null },
      }));

      try {
        const response = await auth.apiCall<{
          message: string;
          data: DeliveryResponse[];
        }>('/api/driver-delivery-management', {
          method: 'GET',
        });

        // Filter and normalize pending deliveries
        const pendingDeliveries = (response.data || [])
          .filter((item: DeliveryResponse) => item.status === "pending")
          .map(normalizeDelivery)
          .filter(delivery => delivery.id !== 'unknown'); // Filter out failed normalizations

        set(state => ({
          availableDeliveries: pendingDeliveries,
          lastFetch: {
            ...state.lastFetch,
            availableDeliveries: Date.now(),
          },
        }));

        console.log(`Fetched ${pendingDeliveries.length} available deliveries`);
        
      } catch (error) {
        console.error("Failed to fetch available deliveries:", error);
        
        let errorMessage = "Failed to load available deliveries";
        if (error instanceof APIError) {
          switch (error.status) {
            case 401:
              errorMessage = "Authentication expired. Please log in again.";
              break;
            case 403:
              errorMessage = "You don't have permission to view deliveries.";
              break;
            case 0:
              errorMessage = "Network connection failed. Please check your internet.";
              break;
            default:
              errorMessage = error.message || errorMessage;
          }
        }

        set(state => ({
          error: { ...state.error, availableDeliveries: errorMessage },
        }));
      } finally {
        set(state => ({
          loading: { ...state.loading, availableDeliveries: false },
        }));
      }
    },

    fetchMyDeliveries: async () => {
      const { loading } = get();
      
      // Prevent concurrent requests
      if (loading.myDeliveries) return;

      set(state => ({
        loading: { ...state.loading, myDeliveries: true },
        error: { ...state.error, myDeliveries: null },
      }));

      try {
        // Fetch both active and completed deliveries in parallel
        const [activeResponse, completedResponse] = await Promise.allSettled([
          auth.apiCall<{ data: DeliveryResponse[] }>('/api/driver-delivery-management?status=accepted', {
            method: 'GET',
          }),
          auth.apiCall<{ data: DeliveryResponse[] }>('/api/driver-delivery-management?status=completed', {
            method: 'GET',
          }),
        ]);

        const activeDeliveries: DeliveryResponse[] = 
          activeResponse.status === 'fulfilled' ? (activeResponse.value.data || []) : [];
        
        const completedDeliveries: DeliveryResponse[] = 
          completedResponse.status === 'fulfilled' ? (completedResponse.value.data || []) : [];

        // Combine and normalize all deliveries
        const allDeliveries = [...activeDeliveries, ...completedDeliveries];
        const normalized = allDeliveries
          .map(normalizeDelivery)
          .filter(delivery => delivery.id !== 'unknown');

        set(state => ({
          myDeliveries: normalized,
          lastFetch: {
            ...state.lastFetch,
            myDeliveries: Date.now(),
          },
        }));

        console.log(`Fetched ${normalized.length} my deliveries`);
        
      } catch (error) {
        console.error("Failed to fetch my deliveries:", error);
        
        let errorMessage = "Failed to load your deliveries";
        if (error instanceof APIError) {
          switch (error.status) {
            case 401:
              errorMessage = "Authentication expired. Please log in again.";
              break;
            case 403:
              errorMessage = "You don't have permission to view deliveries.";
              break;
            case 0:
              errorMessage = "Network connection failed. Please check your internet.";
              break;
            default:
              errorMessage = error.message || errorMessage;
          }
        }

        set(state => ({
          error: { ...state.error, myDeliveries: errorMessage },
        }));
      } finally {
        set(state => ({
          loading: { ...state.loading, myDeliveries: false },
        }));
      }
    },

    acceptDelivery: async (deliveryId: string) => {
      const { loading } = get();
      
      // Prevent concurrent requests
      if (loading.acceptDelivery) return;

      set(state => ({
        loading: { ...state.loading, acceptDelivery: true },
        error: { ...state.error, acceptDelivery: null },
      }));

      try {
        await auth.apiCall(`/api/driver-delivery-management/${deliveryId}`, {
          method: "PUT",
          body: JSON.stringify({ status: "accepted" }),
        });

        // Remove from available deliveries
        set(state => ({
          availableDeliveries: state.availableDeliveries.filter(d => d.id !== deliveryId),
        }));

        // Refresh my deliveries to include the newly accepted one
        await get().fetchMyDeliveries();

        console.log(`Successfully accepted delivery ${deliveryId}`);
        
      } catch (error) {
        console.error("Failed to accept delivery:", error);
        
        let errorMessage = "Failed to accept delivery";
        if (error instanceof APIError) {
          switch (error.status) {
            case 404:
              errorMessage = "Delivery not found or already assigned.";
              break;
            case 409:
              errorMessage = "Delivery has already been accepted by another driver.";
              break;
            case 422:
              errorMessage = "Cannot accept this delivery at this time.";
              break;
            default:
              errorMessage = error.message || errorMessage;
          }
        }

        set(state => ({
          error: { ...state.error, acceptDelivery: errorMessage },
        }));
        throw error;
      } finally {
        set(state => ({
          loading: { ...state.loading, acceptDelivery: false },
        }));
      }
    },

    updateDeliveryStatus: async (deliveryId: string, status) => {
      const { loading } = get();
      
      // Prevent concurrent requests
      if (loading.statusUpdate) return;

      set(state => ({
        loading: { ...state.loading, statusUpdate: true },
        error: { ...state.error, statusUpdate: null },
      }));

      try {
        await auth.apiCall(`/api/driver-delivery-management/${deliveryId}`, {
          method: "PUT",
          body: JSON.stringify({ status }),
        });

        // Update local state optimistically
        set(state => ({
          myDeliveries: state.myDeliveries.map(d =>
            d.id === deliveryId ? { ...d, status } : d
          ),
        }));

        console.log(`Successfully updated delivery ${deliveryId} to status ${status}`);
        
      } catch (error) {
        console.error("Failed to update delivery status:", error);
        
        let errorMessage = "Failed to update delivery status";
        if (error instanceof APIError) {
          switch (error.status) {
            case 404:
              errorMessage = "Delivery not found.";
              break;
            case 400:
              errorMessage = "Invalid status transition.";
              break;
            case 422:
              errorMessage = "Cannot update status at this time.";
              break;
            default:
              errorMessage = error.message || errorMessage;
          }
        }

        set(state => ({
          error: { ...state.error, statusUpdate: errorMessage },
        }));
        
        // Refresh deliveries to get correct state
        await get().fetchMyDeliveries();
        throw error;
      } finally {
        set(state => ({
          loading: { ...state.loading, statusUpdate: false },
        }));
      }
    },

    completeDelivery: async (deliveryId: string) => {
      try {
        await auth.apiCall(`/api/driver-delivery-management/${deliveryId}`, {
          method: "PUT",
          body: JSON.stringify({ status: "completed" }),
        });

        // Update local state
        set(state => ({
          myDeliveries: state.myDeliveries.map(d =>
            d.id === deliveryId ? { ...d, status: "completed" } : d
          ),
        }));

        console.log(`Successfully completed delivery ${deliveryId}`);
        
      } catch (error) {
        console.error("Failed to complete delivery:", error);
        throw error;
      }
    },

    setCurrentDelivery: (delivery: NormalizedDelivery) => {
      set({ currentDelivery: delivery });
    },
  }))
);