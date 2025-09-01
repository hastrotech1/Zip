import { useEffect, useState } from "react";
import axios from "axios";
import { Download, Filter, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentData } from "../../../../../helper/types";
import { Button } from "@/components/ui/button";
import { generatePDF } from "./GeneratePdf";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState<ShipmentData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ShipmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrderHistory = async () => {
     try {
        setIsLoading(true);
        const response = await axios.get("https://ziplugs.geniusexcel.tech/api/shipments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const orders = response.data;
        setOrderHistory(orders);
        setFilteredOrders(orders);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load order history.");
      } finally {
        setIsLoading(false);
      }
      // In a real app, this would use localStorage, but for demo we'll simulate
      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call with demo data
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        // const demoData = [
        //   {
        //     status: "completed",
        //     customer_order_id: "ORD-001",
        //     origin: "New York",
        //     destination: "Los Angeles",
        //     deliveryDate: "2024-12-15",
        //     shippingCost: 25.99,
        //   },
        //   {
        //     status: "pending",
        //     customer_order_id: "ORD-002",
        //     origin: "Chicago",
        //     destination: "Miami",
        //     deliveryDate: "2024-12-20",
        //     shippingCost: 32.5,
        //   },
        //   {
        //     status: "cancelled",
        //     customer_order_id: "ORD-003",
        //     origin: "Seattle",
        //     destination: "Denver",
        //     deliveryDate: "2024-12-10",
        //     shippingCost: 18.75,
        //   },
        // ];

        // setOrderHistory(demoData);
        // setFilteredOrders(demoData);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleFilter = (filterType: string) => {
    setActiveFilter(filterType);
    const filters: Record<string, () => ShipmentData[]> = {
      all: () => orderHistory,
      completed: () =>
        orderHistory.filter((order) => order.status === "completed"),
      pending: () => orderHistory.filter((order) => order.status === "pending"),
      cancelled: () =>
        orderHistory.filter((order) => order.status === "cancelled"),
    };
    setFilteredOrders(filters[filterType]?.() || orderHistory);
  };

  const handleDownloadPDF = async () => {
    if (filteredOrders.length === 0) {
      setError("No orders to export.");
      return;
    }
    generatePDF(filteredOrders);
    // try {
    //   setError(null);
    //   // Simulate PDF download
    //   await new Promise((resolve) => setTimeout(resolve, 500));

    //   // In a real app, this would make an API call
    //   console.log("PDF download initiated");

    //   // Show success message briefly
    //   const link = document.createElement("a");
    //   link.href =
    //     "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKE9yZGVyIEhpc3RvcnkpCi9Qcm9kdWNlciAoRGVtbyBQREYpCi9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZXMKL0tpZHMgWzMgMCBSXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCj4+CmVuZG9iagp4cmVmCjAgNAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDEwNiAwMDAwMCBuIAowMDAwMDAwMTU4IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNAovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMjI2CiUlRU9G";
    //   link.download = "order-history.pdf";
    //   link.click();
    // } catch (error) {
    //   console.error("Error:", error);
    //   setError("Failed to download PDF");
    // }
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-700 text-sm">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="mt-2 text-red-700 hover:bg-red-100 p-0 h-auto font-medium"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Order History Card */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Order History
              </CardTitle>

              <div className="flex flex-col sm:flex-row gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      {activeFilter.charAt(0).toUpperCase() +
                        activeFilter.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleFilter("all")}>
                      All Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilter("completed")}>
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilter("pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilter("cancelled")}>
                      Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={isLoading || filteredOrders.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6">
                <LoadingSkeleton />
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="font-medium text-gray-600">
                          Status
                        </TableHead>
                        <TableHead className="font-medium text-gray-600">
                          Order ID
                        </TableHead>
                        <TableHead className="font-medium text-gray-600">
                          Route
                        </TableHead>
                        <TableHead className="font-medium text-gray-600">
                          Delivery Date
                        </TableHead>
                        <TableHead className="font-medium text-gray-600 text-right">
                          Cost
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <TableRow
                            key={order.customer_order_id}
                            className="border-gray-100 hover:bg-gray-50"
                          >
                            <TableCell>
                              <span
                                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {order.customer_order_id}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {order.origin} → {order.destination}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {formatDate(order.deliveryDate)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${order.shippingCost.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-12 text-gray-500"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                📦
                              </div>
                              <p>No orders found</p>
                              <p className="text-sm">
                                Try adjusting your filters
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3 p-4">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <div
                        key={order.customer_order_id}
                        className="bg-gray-50 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-medium">
                            {order.customer_order_id}
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Route:</span>
                            <span className="font-medium text-right">
                              {order.origin} → {order.destination}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery:</span>
                            <span className="font-medium">
                              {formatDate(order.deliveryDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost:</span>
                            <span className="font-semibold">
                              ${order.shippingCost.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                        <p>No orders found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderHistory;
