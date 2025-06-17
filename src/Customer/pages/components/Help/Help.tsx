// import SideBar from "../sideNav/SideBar";
// import ProfileHeader from "../ProfileHeader/ProfileHeader";
// import HelpIcon from "@mui/icons-material/Help";
// import Box from "@mui/material/Box";
// import { Link } from "react-router-dom";
// import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
// import MobileHeader from "../MobileHeader/MobileHeader";

// interface HelpItemProps {
//   header: string;
//   subContent: string;
//   url: string;
//   urlName: string;
// }

// const helpList = [
//   {
//     header: "Shipment Tracking",
//     subContent:
//       "Lost track of your package? Use our real-time tracking tool to follow your shipment’s journey.",
//     url: "/track-shipment",
//     urlName: "Track Shipment",
//   },
//   {
//     header: "Account Assistance",
//     subContent:
//       "Forgot your password? Trouble logging in? We can help you regain access to your account.",
//     url: "/resetpassword",
//     urlName: "Reset Password",
//   },
//   {
//     header: "Billing and Payments",
//     subContent:
//       "Need help with an invoice or payment method? Our team is ready to assist with any billing",
//     url: "/customer-care",
//     urlName: "Customer Care",
//   },
//   {
//     header: "Schedule a Pickup",
//     subContent:
//       "Need to schedule or reschedule a pickup? We’re here to make it easy.",
//     url: "/schedule-pickup",
//     urlName: "Schedule A Pickup",
//   },
//   {
//     header: "Order Issues",
//     subContent:
//       "Is your package delayed, missing, or damaged? Contact us, and we’ll help resolve it quickly.",
//     url: "/customer-care",
//     urlName: "Customer Care",
//   },
// ];

// interface HelpItemProps {
//   header: string;
//   subContent: string;
//   url: string;
//   urlName: string;
// }

// const HelpItem = ({ header, subContent, url, urlName }: HelpItemProps) => (
//   <Box
//     component="section"
//     className="p-2 md:p-3 border rounded-md flex justify-between items-center"
//   >
//     <div>
//       <h2 className="font-black text-sm md:text-xl">{header}</h2>
//       <p className="mr-3">{subContent}</p>
//     </div>

//     <div className="w-2/3 md:w-40 text-center bg-[#1E3A8A] text-white font-bold p-1 rounded-md">
//       <Link to={url} className="" rel="">
//         {urlName}
//       </Link>
//     </div>
//   </Box>
// );

// const Help = () => {
//   return (
//     <section className="md:flex">
//       {/* SIDEBAR */}
//       <div className="fixed hidden md:block">
//         <SideBar />
//       </div>

//       {/* Main Content */}
//       <main className="w-full md:px-8 md:py-5 md:ml-64">
//         <div className="hidden md:block">
//           <ProfileHeader
//             content={
//               <div className="flex gap-2 items-center text-2xl font-bold">
//                 <HelpIcon />
//                 Help
//               </div>
//             }
//             profilePic="#"
//           />
//         </div>

//         <div className="md:hidden">
//           <MobileHeader />
//         </div>

//         <section className="p-5 md:p-0">
//           <div className="my-3">
//             <h2>How Can We Help?</h2>
//           </div>
//           {/* HELP SECTION */}
//           <section className="grid gap-3">
//             {helpList.map((helpItem) => (
//               <HelpItem key={helpItem.header} {...helpItem} />
//             ))}
//           </section>
//           {/* LIVE CHAT */}
//           <div className="absolute bottom-10">
//             <Link to="#" className="flex items-center gap-3">
//               <MarkChatUnreadIcon className="text-[#1E3A8A] scale-150" />
//               <p className="underline underline-offset-4 ">Live Chat</p>
//             </Link>
//           </div>
//         </section>
//       </main>
//     </section>
//   );
// };

// export default Help;

import { Link } from "react-router-dom";
import SideBar from "../sideNav/SideBar";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import MobileHeader from "../MobileHeader/MobileHeader";
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
    url: "/track-shipment",
    urlName: "Track Shipment",
  },
  {
    header: "Account Assistance",
    subContent:
      "Forgot your password? Trouble logging in? We can help you regain access to your account.",
    url: "/resetpassword",
    urlName: "Reset Password",
  },
  {
    header: "Billing and Payments",
    subContent:
      "Need help with an invoice or payment method? Our team is ready to assist with any billing",
    url: "/customer-care",
    urlName: "Customer Care",
  },
  {
    header: "Schedule a Pickup",
    subContent:
      "Need to schedule or reschedule a pickup? We're here to make it easy.",
    url: "/schedule-pickup",
    urlName: "Schedule A Pickup",
  },
  {
    header: "Order Issues",
    subContent:
      "Is your package delayed, missing, or damaged? Contact us, and we'll help resolve it quickly.",
    url: "/customer-care",
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

        <div className="md:hidden">
          <MobileHeader />
        </div>

        <div className="p-5 md:p-0">
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
