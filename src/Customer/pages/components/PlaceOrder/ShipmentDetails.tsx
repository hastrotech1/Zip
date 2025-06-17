// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import ProfileHeader from "../ProfileHeader/ProfileHeader";
// import { Truck } from "lucide-react";
// import SideBar from "../sideNav/SideBar";
// import MobileHeader from "../MobileHeader/MobileHeader";

// interface ShipmentDetailsType {
//   num_of_packages: string;
//   package_weigth: string;
//   description: string;
//   package_length: string;
//   package_width: string;
//   package_heigth: string;
//   is_fragile: string;
// }

// const generateRandomId = (min: number, max: number): number =>
//   Math.floor(Math.random() * (max - min + 1)) + min;

// const ShipmentDetails = () => {
//   const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetailsType>({
//     num_of_packages: "",
//     package_weigth: "",
//     description: "",
//     package_length: "",
//     package_width: "",
//     package_heigth: "",
//     is_fragile: "",
//   });

//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const user_id = localStorage.getItem("user_id");
//   const pickup_id = generateRandomId(1, 20);
//   const rec_id = generateRandomId(1, 20);
//   const deli_add_id = generateRandomId(1, 20);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setShipmentDetails({
//       ...shipmentDetails,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     const token = localStorage.getItem("accessToken");
//     const requestUrl = `https://ziplogistics.pythonanywhere.com/api/complete-customer-order/${user_id}/pickup=${pickup_id}/recipient=${rec_id}/deliv=${deli_add_id}`;

//     const payload = {
//       num_of_packages: parseInt(shipmentDetails.num_of_packages, 10),
//       package_weigth: parseFloat(shipmentDetails.package_weigth),
//       description: shipmentDetails.description,
//       package_length: parseFloat(shipmentDetails.package_length),
//       package_width: parseFloat(shipmentDetails.package_width),
//       package_heigth: parseFloat(shipmentDetails.package_heigth),
//       is_fragile: shipmentDetails.is_fragile === "Yes",
//     };

//     try {
//       const response = await fetch(requestUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         setSuccess("Order successful");
//         navigate("/vehicle");
//       } else {
//         throw new Error("Failed to submit shipment details");
//       }
//     } catch (error) {
//       setError("An error occurred. Please check your data and try again.");
//       console.error("Error submitting shipment details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       <div className="hidden md:block">
//         <SideBar />
//       </div>

//       <main className="flex-1">
//         <div className="hidden md:block p-8">
//           <ProfileHeader
//             content={
//               <div className="flex items-center gap-2 text-2xl font-bold">
//                 <Truck className="h-6 w-6" />
//                 Shipment Details
//               </div>
//             }
//           />
//         </div>

//         <div className="md:hidden">
//           <MobileHeader />
//         </div>

//         {(loading || error || success) && (
//           <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
//             {loading && (
//               <Alert className="bg-blue-500 text-white">
//                 <AlertDescription>Sending order...</AlertDescription>
//               </Alert>
//             )}
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
//             {success && (
//               <Alert className="bg-green-500 text-white">
//                 <AlertDescription>{success}</AlertDescription>
//               </Alert>
//             )}
//           </div>
//         )}

//         <div className="p-4 md:p-8">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Shipment Details</CardTitle>
//               <p className="text-sm text-muted-foreground">Welcome, Aisha</p>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-8">
//                 <div className="grid md:grid-cols-3 gap-8">
//                   {/* Package Details */}
//                   <div className="space-y-4">
//                     <h3 className="font-medium">Package Details</h3>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="num_of_packages">
//                           Number of Packages
//                         </Label>
//                         <Input
//                           id="num_of_packages"
//                           name="num_of_packages"
//                           value={shipmentDetails.num_of_packages}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="package_weigth">Package Weight</Label>
//                         <Input
//                           id="package_weigth"
//                           name="package_weigth"
//                           value={shipmentDetails.package_weigth}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="description">
//                           Description of Contents
//                         </Label>
//                         <Input
//                           id="description"
//                           name="description"
//                           value={shipmentDetails.description}
//                           onChange={handleInputChange}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Package Dimensions */}
//                   <div className="space-y-4">
//                     <h3 className="font-medium">Package Dimensions</h3>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="package_length">Length</Label>
//                         <Input
//                           id="package_length"
//                           name="package_length"
//                           value={shipmentDetails.package_length}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="package_width">Width</Label>
//                         <Input
//                           id="package_width"
//                           name="package_width"
//                           value={shipmentDetails.package_width}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="package_heigth">Height</Label>
//                         <Input
//                           id="package_heigth"
//                           name="package_heigth"
//                           value={shipmentDetails.package_heigth}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Fragile Package */}
//                   <div className="space-y-4">
//                     <h3 className="font-medium">Is this Package Fragile?</h3>
//                     <RadioGroup
//                       name="is_fragile"
//                       value={shipmentDetails.is_fragile}
//                       onValueChange={(value) =>
//                         handleInputChange({
//                           target: { name: "is_fragile", value },
//                         } as React.ChangeEvent<HTMLInputElement>)
//                       }
//                     >
//                       <div className="flex items-center space-x-2">
//                         <RadioGroupItem value="Yes" id="fragile-yes" />
//                         <Label htmlFor="fragile-yes">Yes</Label>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <RadioGroupItem value="No" id="fragile-no" />
//                         <Label htmlFor="fragile-no">No</Label>
//                       </div>
//                     </RadioGroup>
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <Button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-[#0a1172] hover:bg-[#1e3a8a]"
//                   >
//                     Submit Shipment
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ShipmentDetails;
