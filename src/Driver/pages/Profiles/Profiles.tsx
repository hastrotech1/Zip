import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Phone,
  Mail,
  Star,
  Truck,
  Upload,
  CheckCircle,
  AlertCircle,
  Bell,
  Shield,
  Settings as SettingsIcon,
  LogOut,
  MapPin,
} from "lucide-react";
import { useDriverStore } from "../../store/driverStore";
import { toast } from "@/hooks/use-toast";
import MobileHeader from "../MobileHeader/MobileHeader";

export const Profile = () => {
  const { driver, toggleOnlineStatus } = useDriverStore();

  if (!driver) return null;

  const handleToggleOnline = () => {
    console.log("Updating online status via backend...");

    toggleOnlineStatus();
    toast({
      title: driver?.isOnline ? "You're now offline" : "You're now online",
      description: driver?.isOnline
        ? "You won't receive new delivery requests"
        : "You'll start receiving delivery requests",
    });
  };

  const handleLogout = () => {
    // TODO: Call backend API to logout
    console.log("Logging out via backend...");

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the driver app",
    });
  };

  const handleUpdateProfile = () => {
    // TODO: Call backend API to update profile
    console.log("Updating profile via backend...");

    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated",
    });
  };

  const getVerificationIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-orange-600" />
    );
  };

  const getVerificationText = (verified: boolean) => {
    return verified ? "Verified" : "Pending";
  };

  const getVerificationColor = (verified: boolean) => {
    return verified
      ? "bg-green-100 text-green-800"
      : "bg-orange-100 text-orange-800";
  };

  return (
    <div className="min-h-screen">
      <MobileHeader />

      <main className="pt-20 pb-6 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Profile & Settings
              </h1>
              <p className="text-gray-600">
                Manage your profile and account settings
              </p>
            </div>

            {/* Availability Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Availability Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge
                        className={
                          driver?.isOnline
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {driver?.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {driver?.isOnline
                        ? "Available for deliveries"
                        : "Not receiving delivery requests"}
                    </p>
                  </div>
                  <Switch
                    checked={driver?.isOnline}
                    onCheckedChange={handleToggleOnline}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" alt={driver.name} />
                    <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
                      {driver.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {driver.name}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {driver.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({driver.completedDeliveries} deliveries)
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{driver.email}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" onClick={handleUpdateProfile}>
                    <Upload className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" />
                  <span>Vehicle Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Vehicle Type
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {driver.vehicle.type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Model
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {driver.vehicle.model}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Plate Number
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {driver.vehicle.plateNumber}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleUpdateProfile}
                >
                  Update Vehicle Info
                </Button>
              </CardContent>
            </Card>

            {/* Document Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getVerificationIcon(driver.documents.id.verified)}
                        <span className="font-medium">Identity Document</span>
                      </div>
                      <Badge
                        className={getVerificationColor(
                          driver.documents.id.verified
                        )}
                      >
                        {getVerificationText(driver.documents.id.verified)}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getVerificationIcon(driver.documents.license.verified)}
                        <span className="font-medium">Driver's License</span>
                      </div>
                      <Badge
                        className={getVerificationColor(
                          driver.documents.license.verified
                        )}
                      >
                        {getVerificationText(driver.documents.license.verified)}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getVerificationIcon(driver.documents.vehicle.verified)}
                        <span className="font-medium">Vehicle Documents</span>
                      </div>
                      <Badge
                        className={getVerificationColor(
                          driver.documents.vehicle.verified
                        )}
                      >
                        {getVerificationText(driver.documents.vehicle.verified)}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Delivery Requests</p>
                    <p className="text-sm text-gray-600">
                      Get notified when new deliveries are available
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Updates</p>
                    <p className="text-sm text-gray-600">
                      Receive notifications about order status changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">App Updates</p>
                    <p className="text-sm text-gray-600">
                      Stay informed about app updates and new features
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="w-5 h-5" />
                  <span>Account</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Preferences
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  Help & Support
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {driver.completedDeliveries}
                    </div>
                    <p className="text-sm text-gray-600">
                      Completed Deliveries
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {driver.rating}
                    </div>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Danger Zone */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
