import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import MobileHeader from "../MobileHeader/MobileHeader";
import {
  Bell,
  MapPin,
  Shield,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { useDriverStore } from "../../store/driverStore";
import { toast } from "@/hooks/use-toast";

export const Setting = () => {
  const { driver, toggleOnlineStatus } = useDriverStore();

  const handleToggleOnline = () => {
    toggleOnlineStatus();
    toast({
      title: driver?.isOnline ? "You're now offline" : "You're now online",
      description: driver?.isOnline
        ? "You won't receive new delivery requests"
        : "You'll start receiving delivery requests",
    });
  };

  const handleLogout = () => {
    // TODO: Add logout logic (clear tokens, redirect, etc.)
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the driver app",
    });
  };

  return (
    <div className="min-h-screen">
      <MobileHeader />

      <main className="pt-20 pb-6 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-6">
            {/* Driver Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Driver Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img
                    src={driver?.documents?.id?.verified ? driver?.profile_image ?? "/default-avatar.png" : "/default-avatar.png"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <div className="font-bold text-lg">{driver?.name}</div>
                    <div className="text-gray-600">{driver?.email}</div>
                    <div className="text-gray-600">{driver?.phone}</div>
                    <div className="text-gray-600">
                      Vehicle: {driver?.vehicle?.type} {driver?.vehicle?.model} ({driver?.vehicle?.plateNumber})
                    </div>
                    <div className="text-gray-600">
                      Rating: {driver?.rating} | Completed: {driver?.completedDeliveries}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    <p className="font-medium">Earnings Updates</p>
                    <p className="text-sm text-gray-600">
                      Receive notifications about your earnings
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
