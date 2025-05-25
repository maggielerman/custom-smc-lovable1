
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SignIn: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <ClerkSignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-none p-0",
              headerTitle: "text-xl font-semibold text-gray-800",
              headerSubtitle: "text-sm text-gray-500",
              formButtonPrimary: "bg-book-red hover:bg-red-700 text-white rounded-md px-4 py-2 font-medium",
              formFieldInput: "rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-book-red focus:border-transparent",
              footerActionLink: "text-book-red hover:text-red-700 font-medium",
              socialButtonsBlockButton: "border border-gray-300 rounded-md p-2.5 hover:bg-gray-50",
              formFieldLabel: "text-sm font-medium text-gray-700",
              dividerText: "text-sm text-gray-500",
              formFieldAction: "text-sm text-book-red hover:text-red-700",
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default SignIn;
