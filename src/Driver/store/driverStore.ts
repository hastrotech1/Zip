import { create } from "zustand";
import axios from "axios";

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
    const token = localStorage.getItem('accessToken');
    const response = await fetch('https://ziplugs.geniusexcel.tech/api/driver-delivery-management', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();

    // Filter for pending deliveries only
    const deliveries = result.data
      .filter((item: any) => item.status === "pending")
      .map((item: any) => ({
        id: item.id,
        customer: {
          name: `${item.shipment_info.customer.first_name} ${item.shipment_info.customer.last_name}`,
          phone: item.shipment_info.customer.phone_number,
          profilePicture: item.shipment_info.customer.profile_image,
        },
        estimatedTime: new Date(item.shipment_info.created_at).toLocaleString(),
        package: {
          description: `Order #${item.shipment_info.order_number} - Fee: $${item.shipment_info.estimate_fee}`,
        },
        pickup: {
          address: item.shipment_info.pickup_location,
        },
        delivery: {
          address: item.shipment_info.delivery_location,
        },
        status: item.status,
      }));

    set({ availableDeliveries: deliveries });
  },

  fetchMyDeliveries: async () => {
    const token = localStorage.getItem("accessToken");
    const [activeRes, completedRes] = await Promise.all([
      axios.get("https://ziplugs.geniusexcel.tech/api/driver-delivery-management?status=active", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("https://ziplugs.geniusexcel.tech/api/driver-delivery-management?status=completed", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const normalized = [
      ...activeRes.data.data.map(normalizeDelivery),
      ...completedRes.data.data.map(normalizeDelivery),
    ];

    set({ myDeliveries: normalized });
  },

  acceptDelivery: async (deliveryId: string) => {
    const token = localStorage.getItem("accessToken");
    await axios.post(
      `https://ziplugs.geniusexcel.tech/api/driver-delivery-management/${deliveryId}/accept`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // ...refreshes deliveries...
  },

  updateDeliveryStatus: async (deliveryId: string, status) => {
    const token = localStorage.getItem("accessToken");
    await axios.patch(
      `https://ziplugs.geniusexcel.tech/api/driver-delivery-management/${deliveryId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    set({
      myDeliveries: get().myDeliveries.map((d) =>
        d.id === deliveryId ? { ...d, status } : d
      ),
    });
  },

  completeDelivery: async (deliveryId: string) => {
    const token = localStorage.getItem("accessToken");
    await axios.post(
      `https://ziplugs.geniusexcel.tech/api/driver-delivery-management/${deliveryId}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await get().fetchMyDeliveries();
  },

  setCurrentDelivery: (delivery) => set({ currentDelivery: delivery }),
}));