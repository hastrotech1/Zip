import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Phone, Navigation } from "lucide-react";
import { useDriverStore } from "../../store/driverStore";
import MobileHeader from "../MobileHeader/MobileHeader";
import { toast } from "@/hooks/use-toast";

export const MyDeliveries = () => {
  const {
    myDeliveries,
    updateDeliveryStatus,
    setCurrentDelivery,
    fetchMyDeliveries,
    completeDelivery,
  } = useDriverStore();

  useEffect(() => {
    fetchMyDeliveries();
  }, [fetchMyDeliveries]);

  const activeDeliveries = myDeliveries.filter((d) =>
    ["accepted", "picked_up", "in_transit"].includes(d.status)
  );

  const completedDeliveries = myDeliveries.filter((d) =>
    ["delivered", "cancelled"].includes(d.status)
  );

  const handleStatusUpdate = (
    deliveryId: string,
    status: "picked_up" | "in_transit" | "delivered"
  ) => {
    updateDeliveryStatus(deliveryId, status);

    const statusMessages = {
      picked_up: "Package picked up successfully!",
      in_transit: "Trip started! Safe driving.",
      delivered: "Delivery completed! Well done.",
    };

    toast({
      title: "Status Updated",
      description:
        statusMessages[status as keyof typeof statusMessages] ||
        "Status updated successfully",
    });
  };

  const handleNavigate = (delivery: any) => {
    // TODO: Implement navigation to map view with delivery details
    console.log(`Navigating to delivery ${delivery.id} with integrated map`);
    setCurrentDelivery(delivery);
    toast({
      title: "Navigation Started",
      description: "Opening map with delivery details",
    });
  };

  const handleCompleteOrder = async (deliveryId: string) => {
    try {
      await completeDelivery(deliveryId);
      toast({
        title: "Order Completed",
        description:
          "Delivery has been marked as completed and sent to backend",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to complete order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      accepted: "bg-blue-100 text-blue-800",
      picked_up: "bg-yellow-100 text-yellow-800",
      in_transit: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts = {
      accepted: "Accepted",
      picked_up: "Picked Up",
      in_transit: "In Transit",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const DeliveryCard = ({
    delivery,
    showActions = false,
  }: {
    delivery: any;
    showActions?: boolean;
  }) => (
    <Card className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={delivery.customer.profilePicture}
                alt={delivery.customer.name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {delivery.customer.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {delivery.customer.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {delivery.customer.phone}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(delivery.status)}>
            {getStatusText(delivery.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            {delivery.package.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Pickup</p>
              <p className="text-sm text-gray-600">{delivery.pickup.address}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Delivery</p>
              <p className="text-sm text-gray-600">
                {delivery.delivery.address}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate(delivery)}
          >
            <Navigation className="w-4 h-4 mr-1" />
            Navigate
          </Button>

          {delivery.status === "in_transit" && (
            <Button
              onClick={() => handleCompleteOrder(delivery.id)}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              Order Completed
            </Button>
          )}
        </div>

        {showActions && (
          <div className="grid grid-cols-1 gap-2 pt-4">
            {delivery.status === "accepted" && (
              <Button
                onClick={() => handleStatusUpdate(delivery.id, "picked_up")}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Mark as Picked Up
              </Button>
            )}
            {delivery.status === "picked_up" && (
              <Button
                onClick={() => handleStatusUpdate(delivery.id, "in_transit")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Start Trip
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <MobileHeader />

      <main className="pt-20 pb-6 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
            <p className="text-gray-600">
              Track your current and completed deliveries
            </p>
          </div>

          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">
                Current ({activeDeliveries.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedDeliveries.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-6">
              {activeDeliveries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    No Active Deliveries
                  </h2>
                  <p className="text-gray-600">
                    Accept deliveries to see them here
                  </p>
                </div>
              ) : (
                <div>
                  {activeDeliveries.map((delivery) => (
                    <DeliveryCard
                      key={delivery.id}
                      delivery={delivery}
                      showActions={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {completedDeliveries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    No Completed Deliveries
                  </h2>
                  <p className="text-gray-600">
                    Your delivery history will appear here
                  </p>
                </div>
              ) : (
                <div>
                  {completedDeliveries.map((delivery) => (
                    <DeliveryCard
                      key={delivery.id}
                      delivery={delivery}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};
