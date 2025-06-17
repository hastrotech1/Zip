import { create } from "zustand";

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  isOnline: boolean;
  rating: number;
  completedDeliveries: number;
  vehicle: {
    type: string;
    model: string;
    plateNumber: string;
  };
  documents: {
    id: { verified: boolean; url: string };
    license: { verified: boolean; url: string };
    vehicle: { verified: boolean; url: string };
  };
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  profilePicture?: string;
}

interface Delivery {
  id: string;
  status:
    | "pending"
    | "accepted"
    | "picked_up"
    | "in_transit"
    | "delivered"
    | "cancelled";
  customer: Customer;
  pickup: {
    address: string;
    coordinates: [number, number];
  };
  delivery: {
    address: string;
    coordinates: [number, number];
  };
  package: {
    description: string;
  };
  estimatedTime: string;
  createdAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

interface DriverState {
  driver: Driver | null;
  availableDeliveries: Delivery[];
  myDeliveries: Delivery[];
  currentDelivery: Delivery | null;
  isLoading: boolean;

  // Actions
  setDriver: (driver: Driver) => void;
  toggleOnlineStatus: () => void;
  setAvailableDeliveries: (deliveries: Delivery[]) => void;
  setMyDeliveries: (deliveries: Delivery[]) => void;
  acceptDelivery: (deliveryId: string) => void;
  updateDeliveryStatus: (
    deliveryId: string,
    status: Delivery["status"]
  ) => void;
  setCurrentDelivery: (delivery: Delivery | null) => void;
  setLoading: (loading: boolean) => void;
  fetchAvailableDeliveries: () => Promise<void>;
  fetchMyDeliveries: () => Promise<void>;
  completeDelivery: (deliveryId: string) => Promise<void>;
}

export const useDriverStore = create<DriverState>((set, get) => ({
  driver: {
    id: "1",
    name: "John Doe",
    phone: "+234 801 234 5678",
    email: "john.doe@example.com",
    isOnline: true,
    rating: 4.8,
    completedDeliveries: 47,
    vehicle: {
      type: "Motorcycle",
      model: "Honda CB 150",
      plateNumber: "ABC-123-XY",
    },
    documents: {
      id: { verified: true, url: "" },
      license: { verified: true, url: "" },
      vehicle: { verified: false, url: "" },
    },
  },
  availableDeliveries: [
    {
      id: "1",
      status: "pending",
      customer: {
        id: "c1",
        name: "Sarah Johnson",
        phone: "+234 802 123 4567",
        profilePicture:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      },
      pickup: {
        address: "123 Victoria Island, Lagos",
        coordinates: [3.4189, 6.4281],
      },
      delivery: {
        address: "456 Ikeja GRA, Lagos",
        coordinates: [3.3515, 6.5966],
      },
      package: { description: "Food delivery from KFC" },
      estimatedTime: "45 mins",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      status: "pending",
      customer: {
        id: "c2",
        name: "Mike Chen",
        phone: "+234 803 987 6543",
        profilePicture:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      pickup: { address: "789 Surulere, Lagos", coordinates: [3.3614, 6.5044] },
      delivery: { address: "321 Yaba, Lagos", coordinates: [3.3792, 6.5149] },
      package: { description: "Electronics package" },
      estimatedTime: "30 mins",
      createdAt: new Date().toISOString(),
    },
  ],
  myDeliveries: [],
  currentDelivery: null,
  isLoading: false,

  setDriver: (driver) => set({ driver }),

  toggleOnlineStatus: () =>
    set((state) => ({
      driver: state.driver
        ? { ...state.driver, isOnline: !state.driver.isOnline }
        : null,
    })),

  setAvailableDeliveries: (deliveries) =>
    set({ availableDeliveries: deliveries }),

  setMyDeliveries: (deliveries) => set({ myDeliveries: deliveries }),

  acceptDelivery: (deliveryId) =>
    set((state) => {
      const delivery = state.availableDeliveries.find(
        (d) => d.id === deliveryId
      );
      if (delivery) {
        const acceptedDelivery = {
          ...delivery,
          status: "accepted" as const,
          acceptedAt: new Date().toISOString(),
        };
        return {
          availableDeliveries: state.availableDeliveries.filter(
            (d) => d.id !== deliveryId
          ),
          myDeliveries: [...state.myDeliveries, acceptedDelivery],
          currentDelivery: acceptedDelivery,
        };
      }
      return state;
    }),

  updateDeliveryStatus: (deliveryId, status) =>
    set((state) => {
      // TODO: Call backend API to update status
      console.log(`Updating delivery ${deliveryId} to status: ${status}`);

      return {
        myDeliveries: state.myDeliveries.map((d) =>
          d.id === deliveryId
            ? {
                ...d,
                status,
                ...(status === "picked_up" && {
                  pickedUpAt: new Date().toISOString(),
                }),
                ...(status === "delivered" && {
                  deliveredAt: new Date().toISOString(),
                }),
              }
            : d
        ),
        currentDelivery:
          state.currentDelivery?.id === deliveryId
            ? { ...state.currentDelivery, status }
            : state.currentDelivery,
      };
    }),

  setCurrentDelivery: (delivery) => set({ currentDelivery: delivery }),

  setLoading: (loading) => set({ isLoading: loading }),

  fetchAvailableDeliveries: async () => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      console.log("Fetching available deliveries from backend...");
      // const response = await fetch('/api/deliveries/available');
      // const deliveries = await response.json();
      // set({ availableDeliveries: deliveries });
    } catch (error) {
      console.error("Failed to fetch available deliveries:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyDeliveries: async () => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      console.log("Fetching my deliveries from backend...");
      // const response = await fetch('/api/deliveries/mine');
      // const deliveries = await response.json();
      // set({ myDeliveries: deliveries });
    } catch (error) {
      console.error("Failed to fetch my deliveries:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  completeDelivery: async (deliveryId) => {
    try {
      // TODO: Replace with actual API call
      console.log(`Completing delivery ${deliveryId} via backend...`);
      // await fetch(`/api/deliveries/${deliveryId}/complete`, { method: 'POST' });

      get().updateDeliveryStatus(deliveryId, "delivered");
    } catch (error) {
      console.error("Failed to complete delivery:", error);
    }
  },
}));
