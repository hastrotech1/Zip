// import { useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { MapPin, Package, Clock, Phone } from "lucide-react";
// import { useDriverStore } from "../../store/driverStore";
// import { useNavigate } from "react-router-dom";
// import MobileHeader from "../MobileHeader/MobileHeader";

// export const AvailableDeliveries = () => {
//   const {
//     availableDeliveries,
//     driver,
//     fetchAvailableDeliveries,
//   } = useDriverStore();

//   useEffect(() => {
//     fetchAvailableDeliveries();
//   }, [fetchAvailableDeliveries]);

//   const navigate = useNavigate();
//   const { acceptDelivery } = useDriverStore();

//   const handleAcceptDelivery = async () => {
//     try {
//       await acceptDelivery(delivery_id);
//       navigate('/delivery-history');
//     } catch (error) {
//         console.error('Failed to accept delivery:', error);
//     }
//   };


//   if (!driver?.isOnline) {
//     return (
//       <div className="text-center py-12">
//         <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <MapPin className="w-12 h-12 text-gray-400" />
//         </div>
//         <h2 className="text-xl font-semibold text-gray-900 mb-2">
//           You're Offline
//         </h2>
//         <p className="text-gray-600 mb-4">
//           Turn on availability in Profile & Settings to see deliveries
//         </p>
//         <Button>Go to Profile & Settings</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <MobileHeader />

//       <main className="pt-20 pb-6 px-4">
//         <div className="max-w-3xl mx-auto space-y-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Available Deliveries
//               </h1>
//               <p className="text-gray-600">Accept deliveries near you</p>
//             </div>
//             <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
//               {availableDeliveries.length} Available
//             </Badge>
//           </div>

//           {availableDeliveries.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Package className="w-12 h-12 text-gray-400" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                 No Deliveries Available
//               </h2>
//               <p className="text-gray-600">
//                 Check back later for new delivery opportunities
//               </p>
//             </div>
//           ) : (
//             <div className="grid gap-4">
//               {availableDeliveries.map((delivery) => (
//                 <Card
//                   key={delivery.id}
//                   className="hover:shadow-lg transition-shadow duration-200"
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <Avatar className="w-12 h-12">
//                           <AvatarImage
//                             src={delivery.customer.profilePicture}
//                             alt={delivery.customer.name}
//                           />
//                           <AvatarFallback className="bg-blue-100 text-blue-600">
//                             {delivery.customer.name
//                               .split(" ")
//                               .map((n) => n[0])
//                               .join("")}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <CardTitle className="text-lg font-semibold">
//                             {delivery.customer.name}
//                           </CardTitle>
//                           <p className="text-sm text-gray-600 flex items-center">
//                             <Phone className="w-3 h-3 mr-1" />
//                             {delivery.customer.phone}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Clock className="w-4 h-4 text-gray-500" />
//                         <span className="text-sm text-gray-600">
//                           {delivery.estimatedTime}
//                         </span>
//                       </div>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="space-y-4">
//                     <div className="bg-gray-50 p-3 rounded-lg">
//                       <p className="text-sm font-medium text-gray-700">
//                         {delivery.package.description}
//                       </p>
//                     </div>

//                     <div className="space-y-3">
//                       <div className="flex items-start space-x-3">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-900">
//                             Pickup
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {delivery.pickup.address}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-start space-x-3">
//                         <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-900">
//                             Delivery
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {delivery.delivery.address}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <Button
//                       onClick={handleAcceptDelivery}
//                       className="w-full bg-blue-600 hover:bg-blue-700"
//                     >
//                       Accept Delivery
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Package, Clock, Phone } from "lucide-react";
import { useDriverStore } from "../../store/driverStore";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../MobileHeader/MobileHeader";

export const AvailableDeliveries = () => {
  const {
    availableDeliveries,
    driver,
    fetchAvailableDeliveries,
    acceptDelivery
  } = useDriverStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableDeliveries();
  }, [fetchAvailableDeliveries]);

  const handleAcceptDelivery = async (delivery_id: string) => {
    try {
      await acceptDelivery(delivery_id);
      navigate('/delivery-history');
    } catch (error) {
      console.error('Failed to accept delivery:', error);
    }
  };

  if (!driver?.isOnline) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          You're Offline
        </h2>
        <p className="text-gray-600 mb-4">
          Turn on availability in Profile & Settings to see deliveries
        </p>
        <Button>Go to Profile & Settings</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MobileHeader />

      <main className="pt-20 pb-6 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Available Deliveries
              </h1>
              <p className="text-gray-600">Accept deliveries near you</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              {availableDeliveries.length} Available
            </Badge>
          </div>

          {availableDeliveries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Deliveries Available
              </h2>
              <p className="text-gray-600">
                Check back later for new delivery opportunities
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {availableDeliveries.map((delivery) => (
                <Card
                  key={delivery.id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
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
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {delivery.customer.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {delivery.customer.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {delivery.estimatedTime}
                        </span>
                      </div>
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
                          <p className="text-sm font-medium text-gray-900">
                            Pickup
                          </p>
                          <p className="text-sm text-gray-600">
                            {delivery.pickup.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Delivery
                          </p>
                          <p className="text-sm text-gray-600">
                            {delivery.delivery.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleAcceptDelivery(delivery.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Accept Delivery
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};