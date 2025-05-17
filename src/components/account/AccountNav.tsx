
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { User, BookOpen, FileText, Users, Settings } from "lucide-react";

const navItems = [
  { 
    label: "Overview", 
    href: "/profile", 
    icon: <User className="h-4 w-4 mr-2" /> 
  },
  { 
    label: "My Books", 
    href: "/profile/books", 
    icon: <BookOpen className="h-4 w-4 mr-2" /> 
  },
  { 
    label: "My Drafts", 
    href: "/profile/drafts", 
    icon: <FileText className="h-4 w-4 mr-2" /> 
  },
  { 
    label: "Family Details", 
    href: "/profile/family", 
    icon: <Users className="h-4 w-4 mr-2" /> 
  },
  { 
    label: "Account Settings", 
    href: "/profile/settings", 
    icon: <Settings className="h-4 w-4 mr-2" /> 
  }
];

export default function AccountNav() {
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-book-red text-white"
                : "text-gray-600 hover:bg-book-red/10 hover:text-book-red"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
