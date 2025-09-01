import { create } from "zustand";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

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
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  isOnline: boolean;
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

interface DriverStore {
  driver: Driver | null;
  availableDeliveries: NormalizedDelivery[];
  myDeliveries: NormalizedDelivery[];
  currentDelivery: NormalizedDelivery | null;
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
}

const normalizeDelivery = (d: any): NormalizedDelivery => ({
  id: d.id,
  customer: {
    name: `${d.shipment_info.customer.first_name} ${d.shipment_info.customer.last_name}`,
    phone: d.shipment_info.customer.phone_number,
    profilePicture: d.shipment_info.customer.profile_image,
  },
  package: {
    description: `Order ${d.shipment_info.order_number}`,
  },
  pickup: {
    address: d.shipment_info.pickup_location,
  },
  delivery: {
    address: d.shipment_info.delivery_location,
  },
  estimatedTime: new Date(d.shipment_info.created_at).toLocaleString(),
  status: d.status,
});

export const useDriverStore = create<DriverStore>((set, get) => ({
  driver: {
    id: "", // placeholder
    isOnline: true,
    name: "",
    email: "",
    phone: "",
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

  // Store-level toggleOnlineStatus method
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

  fetchAvailableDeliveries: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("/api/driver-delivery-management", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const normalized = res.data.data.map(normalizeDelivery);
      set({ availableDeliveries: normalized });
    } catch (err) {
      console.error("Failed to fetch available deliveries:", err);
    }
  },

  fetchMyDeliveries: async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Fixed: consistent token key

      // fetch both active + completed in parallel
      const [activeRes, completedRes] = await Promise.all([
        axios.get("/api/driver-delivery-management?status=active", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/driver-delivery-management?status=completed", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const normalized = [
        ...activeRes.data.data.map(normalizeDelivery),
        ...completedRes.data.data.map(normalizeDelivery),
      ];

      set({ myDeliveries: normalized });
    } catch (err) {
      console.error("Failed to fetch my deliveries:", err);
    }
  },

  acceptDelivery: async (deliveryId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `https://ziplugs.geniusexcel.tech/api/driver-delivery-management/${deliveryId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // After accepting, refresh myDeliveries
      await get().fetchMyDeliveries();

      // Remove it from available
      set({
        availableDeliveries: get().availableDeliveries.filter(
          (d) => d.id !== deliveryId
        ),
      });
      
      toast({
        title: "Delivery Accepted!",
        description: "You have successfully accepted this delivery.",
      });
      
      // Note: useNavigate should be called from within a React component, not here
      // You'll need to handle navigation in your component after calling this method
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to accept delivery: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        variant: "destructive",
      });
      console.error("Failed to accept delivery:", err);
      throw err;
    }
  },

  updateDeliveryStatus: async (deliveryId: string, status) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `https://ziplugs.geniusexcel.tech/api/driver-delivery-management/${deliveryId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update in local store
      set({
        myDeliveries: get().myDeliveries.map((d) =>
          d.id === deliveryId ? { ...d, status } : d
        ),
      });
    } catch (err) {
      console.error("Failed to update delivery status:", err);
    }
  },

  completeDelivery: async (deliveryId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `https://ziplugs.geniusexcel.tech/api/driver-delivery-management/${deliveryId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Move from active → completed
      await get().fetchMyDeliveries();
    } catch (err) {
      console.error("Failed to complete delivery:", err);
      throw err;
    }
  },

  setCurrentDelivery: (delivery) => set({ currentDelivery: delivery }),
}));