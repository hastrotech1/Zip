import { Link } from "react-router-dom";
import SideBar from "../sideNav/SideBar";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import Navbar from "../MobileHeader/navBar";
import { HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpItemProps {
  header: string;
  subContent: string;
  url: string;
  urlName: string;
}

const helpList: HelpItemProps[] = [
  {
    header: "Shipment Tracking",
    subContent:
      "Lost track of your package? Use our real-time tracking tool to follow your shipment's journey.",
    url: "#",
    urlName: "Track Shipment",
  },
  {
    header: "Account Assistance",
    subContent:
      "Forgot your password? Trouble logging in? We can help you regain access to your account.",
    url: "#",
    urlName: "Reset Password",
  },
  {
    header: "Billing and Payments",
    subContent:
      "Need help with an invoice or payment method? Our team is ready to assist with any billing",
    url: "#",
    urlName: "Customer Care",
  },
  {
    header: "Schedule a Pickup",
    subContent:
      "Need to schedule or reschedule a pickup? We're here to make it easy.",
    url: "#",
    urlName: "Schedule A Pickup",
  },
  {
    header: "Order Issues",
    subContent:
      "Is your package delayed, missing, or damaged? Contact us, and we'll help resolve it quickly.",
    url: "#",
    urlName: "Customer Care",
  },
];

const HelpItem = ({ header, subContent, url, urlName }: HelpItemProps) => (
  <Card className="transition-all hover:shadow-md">
    <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-2">
        <CardTitle className="text-lg md:text-xl font-bold">{header}</CardTitle>
        <CardDescription className="text-sm md:text-base">
          {subContent}
        </CardDescription>
      </div>
      <Button className="w-full md:w-40 bg-blue-900 hover:bg-blue-800" asChild>
        <Link to={url}>
          <span>{urlName}</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const Help = () => {
  return (
    <section className="md:flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed hidden md:block">
        <SideBar />
      </div>

      {/* Main Content */}
      <main className="w-full md:px-8 md:py-5 md:ml-64">
        <div className="hidden md:block">
          <ProfileHeader
            content={
              <div className="flex items-center gap-2 text-2xl font-bold">
                <HelpCircle className="h-6 w-6" />
                Help
              </div>
            }
            profilePic="#"
          />
        </div>

        <Navbar pageName="Help" />

        {/* Add top margin to avoid overlap with navbar */}
        <div className="p-4 md:p-0 mt-16 md:mt-0">
          <Card className="mb-6 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                How Can We Help?
              </CardTitle>
              <CardDescription>
                Select a category below to find the help you need
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Help Items Grid */}
          <div className="grid gap-4">
            {helpList.map((helpItem) => (
              <HelpItem key={helpItem.header} {...helpItem} />
            ))}
          </div>

          {/* Live Chat Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="fixed bottom-8 left-8 md:left-auto md:right-8 gap-2"
                  asChild
                >
                  <Link to="#">
                    <MessageCircle className="h-5 w-5 text-blue-900" />
                    <span className="font-semibold">Live Chat</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Chat with our support team</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </main>
    </section>
  );
};

export default Help;
