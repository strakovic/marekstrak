"use client";

import { cn } from "@/lib/utils";

interface HeroUIIconProps {
  category: string;
  name: string;
  className?: string;
  size?: number | string;
  color?: string;
}

export function HeroUIIcon({ 
  category, 
  name, 
  className, 
  size = 24,
  color = "currentColor" 
}: HeroUIIconProps) {
  const iconPath = `/heroui-icons/${category}/${name}.svg`;
  
  return (
    <img
      src={iconPath}
      alt={name}
      className={cn("inline-block", className)}
      style={{
        width: size,
        height: size,
        filter: color !== "currentColor" ? `var(--icon-color-${color})` : undefined
      }}
    />
  );
}

// Icon component with predefined common icons for easy use
interface IconProps {
  className?: string;
  size?: number | string;
}

// Essential UI Icons
export const ArrowRight = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Arrows" name="Arrow Right" className={className} size={size} />
);

export const ArrowLeft = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Arrows" name="Arrow Left" className={className} size={size} />
);

export const ArrowDown = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Arrows" name="Arrow Down" className={className} size={size} />
);

export const ArrowUp = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Arrows" name="Arrow Up" className={className} size={size} />
);

// Essential UI
export const AddCircle = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Essentional, UI" name="Add Circle" className={className} size={size} />
);

export const CloseCircle = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Essentional, UI" name="Close Circle" className={className} size={size} />
);

export const Edit = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Essentional, UI" name="Pen New Square" className={className} size={size} />
);

export const Delete = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Essentional, UI" name="Trash Bin Minimalistic" className={className} size={size} />
);

export const Settings = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Settings, Fine Tuning" name="Settings" className={className} size={size} />
);

export const Search = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Search" name="Magnifer" className={className} size={size} />
);

// Users
export const User = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Users" name="User" className={className} size={size} />
);

export const Users = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Users" name="Users Group Rounded" className={className} size={size} />
);

// Money & Business
export const Dollar = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Money" name="Dollar Minimalistic" className={className} size={size} />
);

export const Card = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Money" name="Card" className={className} size={size} />
);

export const Wallet = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Money" name="Wallet" className={className} size={size} />
);

// Business Stats
export const Chart = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Business, Statistic" name="Chart" className={className} size={size} />
);

export const ChartSquare = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Business, Statistic" name="Chart Square" className={className} size={size} />
);

// Communication
export const Bell = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Notifications" name="Bell" className={className} size={size} />
);

export const Message = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Messages, Conversation" name="Chat Round Dots" className={className} size={size} />
);

// Files & Folders
export const Document = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Files" name="Document" className={className} size={size} />
);

export const Folder = ({ className, size = 20 }: IconProps) => (
  <HeroUIIcon category="Folders" name="Folder" className={className} size={size} />
);

// Common icon mapping for easy discovery
export const IconLibrary = {
  // Navigation
  navigation: {
    ArrowRight,
    ArrowLeft,
    ArrowDown,
    ArrowUp,
  },
  // Actions
  actions: {
    AddCircle,
    CloseCircle,
    Edit,
    Delete,
    Settings,
    Search,
  },
  // People
  people: {
    User,
    Users,
  },
  // Finance
  finance: {
    Dollar,
    Card,
    Wallet,
  },
  // Analytics
  analytics: {
    Chart,
    ChartSquare,
  },
  // Communication
  communication: {
    Bell,
    Message,
  },
  // Files
  files: {
    Document,
    Folder,
  }
};

// Export common categories for easy access
export const ICON_CATEGORIES = [
  "Arrows",
  "Arrows Action", 
  "Essentional, UI",
  "Users",
  "Money",
  "Business, Statistic",
  "Messages, Conversation",
  "Electronic, Devices",
  "Settings, Fine Tuning",
  "Search",
  "Files",
  "Folders",
  "Security",
  "Shopping, Ecommerce",
  "Time",
  "Weather",
  "Sports",
  "Medicine",
  "Video, Audio, Sound"
] as const;
