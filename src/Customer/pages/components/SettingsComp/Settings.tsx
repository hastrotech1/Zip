import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings as SettingsIcon,
  Edit,
  Save,
  Camera,
  User,
  Phone,
  Mail,
  X,
  Check,
} from "lucide-react";
import SideBar from "../sideNav/SideBar";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import MobileHeader from "../MobileHeader/MobileHeader";
import axios from "axios";

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    profile_picture: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user data from localStorage with better error handling
  const user_id = localStorage.getItem("user_id");
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");
  console.log("Token:", token);
  const googlePicture =
    localStorage.getItem("user_picture") ||
    localStorage.getItem("googlePicture");
  const userEmail =
    localStorage.getItem("user_email") || localStorage.getItem("email");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user_id || !token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://ziplugs.geniusexcel.tech/api/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Set profile data with fallbacks
        setProfile({
          full_name:
            response.data.full_name || localStorage.getItem("user_name") || "",
          phone_number: response.data.phone_number || "",
          email: response.data.email || userEmail || "",
          profile_picture: response.data.profile_picture || googlePicture || "",
        });

        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Profile fetch error:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError("Session expired. Please log in again.");
            // Optionally redirect to login
            // window.location.href = '/login';
          } else if (error.response?.status === 404) {
            setError("User profile not found.");
          } else {
            setError(
              error.response?.data?.message || "Failed to fetch profile data"
            );
          }
        } else {
          setError("Network error. Please check your connection.");
        }

        setProfile({
          full_name: localStorage.getItem("user_name") || "",
          phone_number: "",
          email: userEmail || "",
          profile_picture: googlePicture || "",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, user_id, googlePicture, userEmail]);

  const handleEditClick = () => {
    setError("");
    setSuccess("");
    setIsEditing(!isEditing);
    setPreviewImage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setProfile((prev) => ({
          ...prev,
          profile_picture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = async () => {
    if (!user_id || !token) {
      setError("Authentication required. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const sendData = {
      full_name: profile.full_name,
      phone_number: profile.phone_number,
      profile_picture: profile.profile_picture,
    };

    try {
      const response = await axios.patch(
        `https://ziplugs.geniusexcel.tech/api/auth/user`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update localStorage with new data
      if (profile.profile_picture) {
        localStorage.setItem("user_picture", profile.profile_picture);
      }
      if (profile.full_name) {
        localStorage.setItem("user_name", profile.full_name);
      }

      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setPreviewImage("");

      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Save error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else if (error.response?.status === 403) {
          setError("You don't have permission to update this profile.");
        } else {
          setError(error.response?.data?.message || "Failed to update profile");
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreviewImage("");
    setError("");
    setSuccess("");

    // Reset profile to original state
    setProfile({
      full_name: localStorage.getItem("user_name") || "",
      phone_number: profile.phone_number, // Keep the current phone number
      email: userEmail || "",
      profile_picture: googlePicture || "",
    });
  };

  const currentProfilePicture = previewImage || profile.profile_picture;

  // Show loading state during initial fetch
  if (isLoading && !profile.email && !profile.full_name) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <SideBar />
        </div>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <SideBar />
      </div>
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <main className="flex-1">
        <div className="hidden md:block p-4 lg:p-8">
          <ProfileHeader
            content={
              <div className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-gray-800">
                <SettingsIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                Settings
              </div>
            }
            profilePic={currentProfilePicture}
          />
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 animate-in slide-in-from-top-2"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800 animate-in slide-in-from-top-2">
              <Check className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Personal Information
              </h2>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="h-8 w-8 md:h-9 md:w-auto md:px-3"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Cancel</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveClick}
                      className="h-8 w-8 md:h-9 md:w-auto md:px-3 bg-[#0a1172] hover:bg-[#1e3a8a]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <Save className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">Save</span>
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="h-8 w-8 md:h-9 md:w-auto md:px-3"
                  >
                    <Edit className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Edit</span>
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6 space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {currentProfilePicture ? (
                      <img
                        src={currentProfilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${
                        currentProfilePicture ? "hidden" : ""
                      }`}
                    >
                      <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      onClick={handleImageClick}
                      className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-[#0a1172] hover:bg-[#1e3a8a] rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105"
                      title="Change profile picture"
                    >
                      <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </button>
                  )}
                </div>

                {isEditing && (
                  <p className="text-sm text-gray-500 text-center">
                    Click the camera icon to change your profile picture
                  </p>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  title="Upload profile picture"
                  aria-label="Upload profile picture"
                />
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="p-3 border rounded-lg bg-gray-50 text-gray-800 min-h-[42px] flex items-center">
                      {profile.full_name || "Not provided"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      name="phone_number"
                      value={profile.phone_number}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                      type="tel"
                    />
                  ) : (
                    <div className="p-3 border rounded-lg bg-gray-50 text-gray-800 min-h-[42px] flex items-center">
                      {profile.phone_number || "Not provided"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <div className="p-3 border rounded-lg bg-gray-100 text-gray-600 min-h-[42px] flex items-center">
                    {profile.email || "Not provided"}
                  </div>
                  <p className="text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              {/* Mobile Save Button */}
              {isEditing && (
                <div className="md:hidden pt-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
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
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
