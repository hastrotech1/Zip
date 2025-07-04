import React, { useEffect, useState } from "react";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import SideBar from "../sideNav/SideBar";
import MobileHeader from "../MobileHeader/MobileHeader";
import { Bell, AlertTriangle, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Notification data interface
interface Notification {
  id: string;
  orderID: string;
  title: string;
  description: string;
  date: string;
  type?: "info" | "success" | "warning" | "error";
  isRead?: boolean;
}

const NotificationCard: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
      case "error":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
      }`}
    >
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {getNotificationIcon()}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold leading-tight truncate">
                {notification.title}
              </CardTitle>
              <CardDescription className="mt-1">
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal text-xs text-muted-foreground hover:text-primary"
                  asChild
                >
                  <a href={`/orders/${notification.orderID}`}>
                    Order #{notification.orderID}
                  </a>
                </Button>
              </CardDescription>
            </div>
          </div>
          <div className="flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className="text-xs whitespace-nowrap"
                  >
                    {new Date(notification.date).toLocaleDateString()}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{new Date(notification.date).toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {notification.description}
        </p>
      </CardContent>
    </Card>
  );
};

const NotificationsSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="animate-pulse">
        <CardHeader className="space-y-2 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const EmptyNotifications: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="rounded-full bg-muted p-6 mb-4">
      <Bell className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
    <p className="text-sm text-muted-foreground max-w-sm">
      When you have new order updates or important messages, they'll appear
      here.
    </p>
  </div>
);

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/notifications");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Notification[] = await response.json();
        setNotifications(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(`Failed to load notifications: ${errorMessage}`);
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <section className="md:flex min-h-screen bg-background">
      {/* Sidebar - Desktop only */}
      <div className="fixed hidden md:block z-10">
        <SideBar />
      </div>
      <div className="md:hidden mb-20">
        <MobileHeader />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-64">
        {/* Desktop Header */}
        <div className="hidden md:block md:px-8 md:py-5">
          <ProfileHeader
            content={
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
            }
            profilePic="#"
          />
        </div>
        {/* Content */}
        <div className="px-4 md:px-8 pb-6">
          {/* Mobile Title */}
          <div className="md:hidden pt-4 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold">Notifications</h1>
              </div>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} new</Badge>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)]">
            {loading ? (
              <NotificationsSkeleton />
            ) : error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading Notifications</AlertTitle>
                <AlertDescription className="mt-2">
                  {error}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full sm:w-auto"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            ) : notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            ) : (
              <EmptyNotifications />
            )}
          </ScrollArea>
        </div>
      </main>
    </section>
  );
};

export default Notifications;
