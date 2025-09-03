import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Save, User, Phone, Mail, Check } from "lucide-react";
// import SideBar from "../sideNav/SideBar";
// import ProfileHeader from "../ProfileHeader/ProfileHeader";
import Navbar from "../MobileHeader/navBar";

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
      <Navbar pageName="Settings" />

      <main className="flex-1 p-14">

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
