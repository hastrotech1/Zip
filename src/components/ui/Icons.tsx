import {
  Home,
  Truck,
  History,
  Wallet,
  HelpCircle,
  Settings,
  LogOut,
  Bell,
  Menu,
  User,
  MessageSquare,
  Edit,
  ChevronRight,
  ChevronLeft,
  type Icon as LucideIcon,
  Save,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
  Save: Save,
  home: Home,
  truck: Truck,
  history: History,
  payment: Wallet,
  help: HelpCircle,
  settings: Settings,
  logout: LogOut,
  notifications: Bell,
  menu: Menu,
  user: User,
  chat: MessageSquare,
  edit: Edit,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  logo: ({ ...props }: React.ComponentProps<typeof LucideIcon>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Add your custom logo SVG path here */}
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
};
