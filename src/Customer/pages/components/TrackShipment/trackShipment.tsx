import React, { useState, useEffect, useRef } from "react";
import SideBar from "../sideNav/SideBar";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import MobileHeader from "../MobileHeader/MobileHeader";
import { MapPin, Package, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Define interfaces for API responses
interface LocationResponse {
  id: string;
  latitude: string;
  longitude: string;
  location_address: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  location_postal_code: string | null;
  location_description: string | null;
}

interface ErrorResponse {
  message: string;
}

interface OrderData {
  id: string;
  status: string;
  deliveryDate: string;
  location?: LocationResponse;
}

// Mapbox token - replace with your actual token
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGFzdHJvLXRlY2giLCJhIjoiY203bXdkN3hpMGp3bjJrc2RtdW1odTJjbyJ9.YnSynYzhxYvs_XHa0j2QyA";
mapboxgl.accessToken = MAPBOX_TOKEN;

// Default center coordinates
const DEFAULT_CENTER = {
  lat: 6.5244,
  lng: 3.3792, // Lagos
};

const getStatusBadgeVariant = (status: string): BadgeProps["variant"] => {
  const statusMap: Record<string, BadgeProps["variant"]> = {
    "In Transit": "default",
    Delivered: "default",
    Delayed: "destructive",
    Processing: "secondary",
    "Out for Delivery": "default",
    Pending: "secondary",
    Unassigned: "outline",
  };
  return statusMap[status] || "outline";
};

const TrackShipment: React.FC = () => {
  const [location_id, setTrackingID] = useState<string>("");
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [driverPosition, setDriverPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

  // Helper function to get user ID (implement based on your auth system)
  const user_id = localStorage.getItem("user_id");

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current) return; // Initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update marker position when driver position changes
  useEffect(() => {
    if (!map.current) return;

    // Remove existing marker if any
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }

    // Remove existing popup if any
    if (popup.current) {
      popup.current.remove();
      popup.current = null;
    }

    if (driverPosition) {
      // Create popup
      popup.current = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div>
          <h3 style="font-weight: 500;">Driver Location</h3>
          ${
            currentOrder?.location?.location_address
              ? `<p>${currentOrder.location.location_address}</p>`
              : ""
          }
          <p style="font-size: 0.875rem; color: #6b7280;">
            Last updated: ${new Date().toLocaleTimeString()}
          </p>
        </div>`
      );

      // Create new marker
      marker.current = new mapboxgl.Marker()
        .setLngLat([driverPosition.lng, driverPosition.lat])
        .setPopup(popup.current)
        .addTo(map.current);

      // Fly to the marker position
      map.current.flyTo({
        center: [driverPosition.lng, driverPosition.lat],
        zoom: 15,
        essential: true,
      });
    }
  }, [driverPosition, currentOrder]);

  // Set up polling interval for location updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollLocation = async () => {
      if (currentOrder?.id && currentOrder.status === "In Transit") {
        try {
          const response = await fetch(
            `https://ziplogisitics.pythonanywhere.com/api/track-customer-order/${user_id}/order-id=${currentOrder.id}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location update");
          }

          const data: LocationResponse | ErrorResponse = await response.json();

          if ("latitude" in data && "longitude" in data) {
            const newPosition = {
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude),
            };
            setDriverPosition(newPosition);
          }
        } catch (error) {
          console.error("Error polling location:", error);
        }
      }
    };

    if (currentOrder?.id) {
      intervalId = setInterval(pollLocation, 30000); // Poll every 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentOrder, user_id]);

  // Handle tracking the shipment
  const handleTrackShipment = async () => {
    if (location_id.trim() === "") {
      setError("Please enter a valid Order ID");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://ziplogisitics.pythonanywhere.com/api/track-customer-order/${user_id}/order-id=${location_id}`
      );

      if (!response.ok) {
        throw new Error("Failed to track shipment");
      }

      const data: LocationResponse | ErrorResponse = await response.json();

      if ("message" in data) {
        // Handle various status messages
        let status: string;
        switch (data.message) {
          case "Order is not completed yet":
            status = "Processing";
            break;
          case "Order has been delivered":
            status = "Delivered";
            break;
          case "Delivery is still pending":
            status = "Pending";
            break;
          case "No driver assigned to delivery":
            status = "Unassigned";
            break;
          default:
            status = "Processing";
        }

        setCurrentOrder({
          id: location_id,
          status,
          deliveryDate: new Date().toLocaleDateString(),
        });

        if (status !== "In Transit") {
          setDriverPosition(null);
        }
      } else {
        // We have location data
        setCurrentOrder({
          id: location_id,
          status: "In Transit",
          deliveryDate: new Date().toLocaleDateString(),
          location: data,
        });

        const newPosition = {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
        };
        setDriverPosition(newPosition);
      }

      setError(null);
    } catch (error) {
      setError("Failed to track shipment. Please try again.");
      console.error("Error tracking shipment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Copy tracking ID to clipboard
  const handleCopyTrackingId = () => {
    if (currentOrder?.id) {
      navigator.clipboard
        .writeText(currentOrder.id)
        .then(() => {
          // You might want to show a toast notification here
          console.log("Copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
        });
    }
  };

  return (
    <section className="md:flex min-h-screen bg-background">
      <div className="fixed hidden md:block z-50">
        <SideBar />
      </div>

      <main className="w-full md:ml-64 md:px-8 md:py-5 relative">
        <div className="hidden md:block">
          <ProfileHeader
            content={
              <div className="flex items-center gap-2 text-2xl font-bold">
                <MapPin className="h-6 w-6" />
                Track Location
              </div>
            }
          />
        </div>

        <div className="md:hidden">
          <MobileHeader />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-0 mt-6">
          {/* Track Shipment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Track Shipment
              </CardTitle>
              <CardDescription>
                Enter your Order ID to track your package in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                value={location_id}
                onChange={(e) => setTrackingID(e.target.value)}
                placeholder="Enter Order ID"
                className="font-medium"
              />
              <Button
                onClick={handleTrackShipment}
                className="w-full bg-blue-900 hover:bg-blue-800"
                disabled={loading}
              >
                {loading ? "Tracking..." : "Track Package"}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Current Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Current Status
              </CardTitle>
              <CardDescription>
                View your shipment's current status and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentOrder ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Order ID:</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger onClick={handleCopyTrackingId}>
                          <Badge variant="outline">{currentOrder.id}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>Click to copy</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Status:</p>
                    <Badge variant={getStatusBadgeVariant(currentOrder.status)}>
                      {currentOrder.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Delivery Date:</p>
                    <p className="text-muted-foreground">
                      {currentOrder.deliveryDate}
                    </p>
                  </div>
                  {currentOrder.location?.location_address && (
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Current Location:</p>
                      <p className="text-muted-foreground">
                        {currentOrder.location.location_address}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertTitle>No Orders Found</AlertTitle>
                  <AlertDescription>
                    Enter an Order ID above to track your shipment.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Map Card */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipment Location
              </CardTitle>
              <CardDescription>
                Track your shipment's location in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={mapContainer}
                className="h-[50vh] md:h-[70vh] rounded-lg overflow-hidden border"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </section>
  );
};

export default TrackShipment;
