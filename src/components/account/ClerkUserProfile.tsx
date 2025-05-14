
import React from "react";
import { UserProfile } from "@clerk/clerk-react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const ClerkUserProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-book-red" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="rounded-lg border overflow-hidden bg-white">
      <UserProfile 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border-0",
            navbar: "hidden",
            pageScrollBox: "p-0",
            profilePage: {
              root: "p-0",
            },
            profileSection: {
              root: "p-4 sm:p-6",
            },
            formButtonPrimary: "bg-book-red hover:bg-red-700 text-white rounded-md px-4 py-2 font-medium",
            formFieldInput: "rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-book-red focus:border-transparent",
            formFieldLabel: "text-sm font-medium text-gray-700",
            userPreviewMainIdentifier: "text-gray-800 font-medium",
            userPreviewSecondaryIdentifier: "text-gray-500 text-sm",
            userButtonPopoverCard: "rounded-md shadow-lg",
            userButtonPopoverActionButton: "hover:bg-gray-100 text-gray-700",
            userButtonPopoverActionButtonIcon: "text-gray-500",
            userButtonPopoverActionButtonText: "text-gray-700 font-medium",
            breadcrumbsItem: "text-sm text-book-red",
            breadcrumbs: "mb-6",
            headerTitle: "text-xl font-semibold text-gray-800 mb-4",
            headerSubtitle: "text-gray-500 mb-6",
            accordionTriggerButton: "text-gray-700 font-medium",
          }
        }}
      />
    </div>
  );
};

export default ClerkUserProfile;
