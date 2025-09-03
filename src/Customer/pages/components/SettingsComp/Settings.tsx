// import React, { useState, useEffect, useRef } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Edit,
//   Save,
//   Camera,
//   User,
//   Phone,
//   Mail,
//   X,
//   Check,
//   Cog,
// } from "lucide-react";
// import SideBar from "../sideNav/SideBar";
// import ProfileHeader from "../ProfileHeader/ProfileHeader";
// import MobileHeader from "../MobileHeader/MobileHeader";

// const Settings = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [profile, setProfile] = useState({
//     id: "",
//     email: "",
//     first_name: "",
//     last_name: "",
//     profile_image: "",
//     phone_number: "", // This might not be in the API response initially
//     is_customer: false,
//     is_driver: false
//   });
//   const [previewImage, setPreviewImage] = useState("");
//   const fileInputRef = useRef(null);

//   // Get user data from localStorage with better error handling
//   const user_id = localStorage.getItem("user_id");
//   const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
//   console.log("Token:", token);
  
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!token) {
//         setError("Authentication required. Please log in again.");
//         return;
//       }

//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           `https://ziplugs.geniusexcel.tech/api/auth/user`,
//           {
//             method: 'GET',
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("Session expired. Please log in again.");
//           } else if (response.status === 404) {
//             throw new Error("User profile not found.");
//           } else {
//             throw new Error("Failed to fetch profile data");
//           }
//         }

//         const result = await response.json();
//         console.log("API Response:", result);

//         // Handle the API response structure based on the documentation
//         // API returns { "data": [{ user_object }] }
//         if (result.data && Array.isArray(result.data) && result.data.length > 0) {
//           const userData = result.data[0]; // Get first user from array
//           setProfile({
//             id: userData.id || "",
//             email: userData.email || "",
//             first_name: userData.first_name || "",
//             last_name: userData.last_name || "",
//             profile_image: userData.profile_image || "",
//             phone_number: userData.phone_number || "", // May not exist in API
//             is_customer: userData.is_customer || false,
//             is_driver: userData.is_driver || false
//           });

//           // Update localStorage with fresh data
//           if (userData.first_name && userData.last_name) {
//             localStorage.setItem("user_name", `${userData.first_name} ${userData.last_name}`.trim());
//           }
//           if (userData.email) {
//             localStorage.setItem("user_email", userData.email);
//           }
//           if (userData.profile_image) {
//             localStorage.setItem("user_picture", userData.profile_image);
//           }
//         } else {
//           throw new Error("Invalid response format from server");
//         }

//         setError(""); // Clear any previous errors
//       } catch (error) {
//         console.error("Profile fetch error:", error);
//         setError(error instanceof Error ? error.message : "Network error. Please check your connection.");
        
//         // Fallback to localStorage data
//         const storedName = localStorage.getItem("user_name") || "";
//         const nameParts = storedName.split(" ");
//         setProfile(prev => ({
//           ...prev,
//           first_name: nameParts[0] || "",
//           last_name: nameParts.slice(1).join(" ") || "",
//           email: localStorage.getItem("user_email") || "",
//           profile_image: localStorage.getItem("user_picture") || "",
//         }));
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [token]);

//   const handleEditClick = () => {
//     setError("");
//     setSuccess("");
//     setIsEditing(!isEditing);
//     setPreviewImage("");
//   };

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setProfile((prevProfile) => ({
//       ...prevProfile,
//       [name]: value,
//     }));
//   };

//   const handleImageClick = () => {
//     if (isEditing) {
//       fileInputRef.current?.click();
//     }
//   };

//   const handleImageChange = (e: any) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size should be less than 5MB");
//         return;
//       }

//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         setError("Please select a valid image file");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result as string;
//         if (result) {
//           setPreviewImage(result);
//           setProfile((prev) => ({
//             ...prev,
//             profile_image: result,
//           }));
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveClick = async () => {
//     if (!token) {
//       setError("Authentication required. Please log in again.");
//       return;
//     }

//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     // Prepare data for API - using the correct field names
//     const sendData = {
//       first_name: profile.first_name,
//       last_name: profile.last_name,
//       phone_number: profile.phone_number,
//       profile_image: previewImage || profile.profile_image,
//     };

//     try {
//       const response = await fetch(
//         `https://ziplugs.geniusexcel.tech/api/auth/user`,
//         {
//           method: 'PATCH',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(sendData),
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Session expired. Please log in again.");
//         } else if (response.status === 403) {
//           throw new Error("You don't have permission to update this profile.");
//         } else {
//           const errorData = await response.json().catch(() => ({}));
//           throw new Error(errorData.message || "Failed to update profile");
//         }
//       }

//       const result = await response.json();

//       // Update localStorage with new data
//       if (profile.first_name && profile.last_name) {
//         localStorage.setItem("user_name", `${profile.first_name} ${profile.last_name}`.trim());
//       }
//       if (profile.profile_image) {
//         localStorage.setItem("user_picture", profile.profile_image);
//       }

//       setIsEditing(false);
//       setSuccess("Profile updated successfully!");
//       setPreviewImage("");

//       console.log("Profile updated:", result);
//     } catch (error) {
//       console.error("Save error:", error);
//       setError(error instanceof Error ? error.message : "Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancelEdit = async () => {
//     setIsEditing(false);
//     setPreviewImage("");
//     setError("");
//     setSuccess("");

//     // Reset to original profile data by re-fetching from server
//     if (!token) return;

//     try {
//       const response = await fetch(
//         `https://ziplugs.geniusexcel.tech/api/auth/user`,
//         {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.ok) {
//         const result = await response.json();
//         if (result.data && Array.isArray(result.data) && result.data.length > 0) {
//           const userData = result.data[0];
//           setProfile({
//             id: userData.id || "",
//             email: userData.email || "",
//             first_name: userData.first_name || "",
//             last_name: userData.last_name || "",
//             profile_image: userData.profile_image || "",
//             phone_number: userData.phone_number || "",
//             is_customer: userData.is_customer || false,
//             is_driver: userData.is_driver || false
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error resetting profile:", error);
//       // Fallback to localStorage data
//       const storedName = localStorage.getItem("user_name") || "";
//       const nameParts = storedName.split(" ");
//       setProfile(prev => ({
//         ...prev,
//         first_name: nameParts[0] || "",
//         last_name: nameParts.slice(1).join(" ") || "",
//         email: localStorage.getItem("user_email") || "",
//         profile_image: localStorage.getItem("user_picture") || "",
//       }));
//     }
//   };

//   const currentProfilePicture = previewImage || profile.profile_image;
//   const fullName = `${profile.first_name} ${profile.last_name}`.trim();

//   // Show loading state during initial fetch
//   if (isLoading && !profile.email && !fullName) {
//     return (
//       <div className="flex min-h-screen bg-gray-50">
//         <div className="hidden md:block">
//           <SideBar />
//         </div>
//         <main className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
//             <p className="text-gray-600">Loading profile...</p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="hidden md:block">
//         <SideBar />
//       </div>
//       <div className="md:hidden">
//         <MobileHeader />
//       </div>

//       <main className="flex-1">
//         <div className="hidden md:block p-4 lg:p-8">
//           <ProfileHeader
//             content={
//               <div className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-gray-800">
//                 <Cog className="h-5 w-5 lg:h-6 lg:w-6" />
//                 Settings
//               </div>
//             }
//             profilePic={currentProfilePicture}
//           />
//         </div>

//         <div className="p-4 md:p-6 lg:p-8">
//           {error && (
//             <Alert
//               variant="destructive"
//               className="mb-4 animate-in slide-in-from-top-2"
//             >
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {success && (
//             <Alert className="mb-4 border-green-200 bg-green-50 text-green-800 animate-in slide-in-from-top-2">
//               <Check className="h-4 w-4" />
//               <AlertDescription>{success}</AlertDescription>
//             </Alert>
//           )}

//           <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white">
//             <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6 border-b border-gray-100">
//               <h2 className="text-lg md:text-xl font-bold text-gray-800">
//                 Personal Information
//               </h2>
//               <div className="flex gap-2">
//                 {isEditing ? (
//                   <>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={handleCancelEdit}
//                       className="h-8 w-8 md:h-9 md:w-auto md:px-3"
//                       disabled={isLoading}
//                     >
//                       <X className="h-4 w-4 md:mr-2" />
//                       <span className="hidden md:inline">Cancel</span>
//                     </Button>
//                     <Button
//                       size="sm"
//                       onClick={handleSaveClick}
//                       className="h-8 w-8 md:h-9 md:w-auto md:px-3 bg-[#0a1172] hover:bg-[#1e3a8a]"
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                       ) : (
//                         <>
//                           <Save className="h-4 w-4 md:mr-2" />
//                           <span className="hidden md:inline">Save</span>
//                         </>
//                       )}
//                     </Button>
//                   </>
//                 ) : (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={handleEditClick}
//                     className="h-8 w-8 md:h-9 md:w-auto md:px-3"
//                   >
//                     <Edit className="h-4 w-4 md:mr-2" />
//                     <span className="hidden md:inline">Edit</span>
//                   </Button>
//                 )}
//               </div>
//             </CardHeader>

//             <CardContent className="p-4 md:p-6 space-y-6">
//               {/* Profile Picture Section */}
//               <div className="flex flex-col items-center space-y-4">
//                 <div className="relative group">
//                   <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
//                     {currentProfilePicture ? (
//                       <img
//                         src={currentProfilePicture}
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           // Fallback if image fails to load
//                           e.currentTarget.style.display = "none";
//                           e.currentTarget.nextElementSibling?.classList.remove(
//                             "hidden"
//                           );
//                         }}
//                       />
//                     ) : null}
//                     <div
//                       className={`w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${
//                         currentProfilePicture ? "hidden" : ""
//                       }`}
//                     >
//                       <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
//                     </div>
//                   </div>

//                   {isEditing && (
//                     <button
//                       onClick={handleImageClick}
//                       className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-[#0a1172] hover:bg-[#1e3a8a] rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105"
//                       title="Change profile picture"
//                     >
//                       <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
//                     </button>
//                   )}
//                 </div>

//                 {isEditing && (
//                   <p className="text-sm text-gray-500 text-center">
//                     Click the camera icon to change your profile picture
//                   </p>
//                 )}

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                   title="Upload profile picture"
//                   aria-label="Upload profile picture"
//                 />
//               </div>

//               {/* Form Fields */}
//               <div className="space-y-4">
//                 {/* First Name Field */}
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                     <User className="w-4 h-4" />
//                     First Name
//                   </label>
//                   {isEditing ? (
//                     <Input
//                       name="first_name"
//                       value={profile.first_name}
//                       onChange={handleChange}
//                       className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Enter your first name"
//                     />
//                   ) : (
//                     <div className="p-3 border rounded-lg bg-gray-50 text-gray-800 min-h-[42px] flex items-center">
//                       {profile.first_name || "Not provided"}
//                     </div>
//                   )}
//                 </div>

//                 {/* Last Name Field */}
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                     <User className="w-4 h-4" />
//                     Last Name
//                   </label>
//                   {isEditing ? (
//                     <Input
//                       name="last_name"
//                       value={profile.last_name}
//                       onChange={handleChange}
//                       className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Enter your last name"
//                     />
//                   ) : (
//                     <div className="p-3 border rounded-lg bg-gray-50 text-gray-800 min-h-[42px] flex items-center">
//                       {profile.last_name || "Not provided"}
//                     </div>
//                   )}
//                 </div>

//                 {/* Phone Number Field */}
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                     <Phone className="w-4 h-4" />
//                     Phone Number
//                   </label>
//                   {isEditing ? (
//                     <Input
//                       name="phone_number"
//                       value={profile.phone_number}
//                       onChange={handleChange}
//                       className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Enter your phone number"
//                       type="tel"
//                     />
//                   ) : (
//                     <div className="p-3 border rounded-lg bg-gray-50 text-gray-800 min-h-[42px] flex items-center">
//                       {profile.phone_number || "Not provided"}
//                     </div>
//                   )}
//                 </div>

//                 {/* Email Field (Read-only) */}
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                     <Mail className="w-4 h-4" />
//                     Email Address
//                   </label>
//                   <div className="p-3 border rounded-lg bg-gray-100 text-gray-600 min-h-[42px] flex items-center">
//                     {profile.email || "Not provided"}
//                   </div>
//                   <p className="text-xs text-gray-500">
//                     Email cannot be changed
//                   </p>
//                 </div>

//                 {/* Account Type Display */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Account Type
//                   </label>
//                   <div className="flex gap-2 flex-wrap">
//                     {profile.is_customer && (
//                       <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
//                         Customer
//                       </span>
//                     )}
//                     {profile.is_driver && (
//                       <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
//                         Driver
//                       </span>
//                     )}
//                     {!profile.is_customer && !profile.is_driver && (
//                       <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
//                         Not specified
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Mobile Save Button */}
//               {isEditing && (
//                 <div className="md:hidden pt-4 border-t border-gray-100">
//                   <div className="flex gap-3">
//                     <Button
//                       variant="outline"
//                       onClick={handleCancelEdit}
//                       className="flex-1"
//                       disabled={isLoading}
//                     >
//                       <X className="mr-2 h-4 w-4" />
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={handleSaveClick}
//                       className="flex-1 bg-[#0a1172] hover:bg-[#1e3a8a]"
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         <>
//                           <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="mr-2 h-4 w-4" />
//                           Save Changes
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Settings;

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Save, User, Phone, Mail, Check } from "lucide-react";
// import SideBar from "../sideNav/SideBar";
// import ProfileHeader from "../ProfileHeader/ProfileHeader";
import MobileHeader from "../MobileHeader/MobileHeader";


interface ApiProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  is_customer: boolean;
  is_driver: boolean;
}

interface LocalProfile {
  phone_number: string;
}

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [apiProfile, setApiProfile] = useState<ApiProfile>({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    profile_image: "",
    is_customer: false,
    is_driver: false,
  });

  const [localProfile, setLocalProfile] = useState<LocalProfile>({
    phone_number: localStorage.getItem("user_phone") || "",
  });

  const [previewImage, setPreviewImage] = useState("");

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");


  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }
      try {
        setIsLoading(true);
        const res = await fetch(`https://ziplugs.geniusexcel.tech/api/auth/user`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const result = await res.json();
        if (result.data?.[0]) {
          const userData = result.data[0];
          setApiProfile({
            id: userData.id || "",
            email: userData.email || "",
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            profile_image: userData.profile_image || "",
            is_customer: userData.is_customer || false,
            is_driver: userData.is_driver || false,
          });

          // persist API-backed values
          if (userData.first_name && userData.last_name) {
            localStorage.setItem("user_name", `${userData.first_name} ${userData.last_name}`);
          }
          if (userData.email) localStorage.setItem("user_email", userData.email);
          if (userData.profile_image) localStorage.setItem("user_picture", userData.profile_image);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token]);


  const handleChangeApi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLocalProfile({ phone_number: value });
    localStorage.setItem("user_phone", value);
  };

  const handleSaveClick = async () => {
    if (!token) {
      setError("Authentication required. Please log in again.");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");


    const sendData = {
      first_name: apiProfile.first_name,
      last_name: apiProfile.last_name,
      profile_image: previewImage || apiProfile.profile_image,
    };

    try {
      const res = await fetch(`https://ziplugs.geniusexcel.tech/api/auth/user`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      await res.json();
      localStorage.setItem("user_name", `${apiProfile.first_name} ${apiProfile.last_name}`);
      if (apiProfile.profile_image) localStorage.setItem("user_picture", apiProfile.profile_image);

      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setPreviewImage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Render phone_number from localProfile (not API)
  // (rest of your JSX stays same, just swap where needed)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ...sidebar + headers... */}

      <main className="flex-1 p-4">
        <div className="md:hidden">
            <MobileHeader />
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            ) : (
              <Button
                      onClick={handleSaveClick}
                      className="flex-1 bg-[#0a1172] hover:bg-[#1e3a8a]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* First Name */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" /> First Name
              </label>
              {isEditing ? (
                <Input name="first_name" value={apiProfile.first_name} onChange={handleChangeApi} />
              ) : (
                <div className="p-3 border rounded bg-gray-50">{apiProfile.first_name || "Not provided"}</div>
              )}
            </div>

            {/* Phone Number (local-only) */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              {isEditing ? (
                <Input value={localProfile.phone_number} onChange={handleChangeLocal} />
              ) : (
                <div className="p-3 border rounded bg-gray-50">{localProfile.phone_number || "Not provided"}</div>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <div className="p-3 border rounded bg-gray-100 text-gray-600">{apiProfile.email}</div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
