
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, AlertTriangle, KeyRound, ShieldCheck, Lock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AccountSettings() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    activityUpdates: true,
    darkMode: false,
  });

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast.success("Preference updated");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  
  const handleDeleteAccount = async () => {
    setDeleting(true);
    
    // Simulate account deletion process
    setTimeout(() => {
      setDeleting(false);
      toast.success("Account deletion request submitted");
      // In a real implementation, we'd delete the user account
      // and then sign them out
      navigate("/");
    }, 1500);
  };

  const handlePasswordChange = () => {
    toast.info("Password reset email sent. Check your inbox.");
    // In a real implementation, we would trigger a password reset email
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2 text-blue-500" /> 
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Multi-Factor Authentication (MFA)</Label>
                <p className="text-sm text-muted-foreground">
                  Protect your account with an additional verification step
                </p>
              </div>
              
              <div className="flex items-center">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://clerk.com/docs/authentication/configuration/multi-factor-authentication" target="_blank" rel="noopener noreferrer">
                    <ShieldCheck className="h-4 w-4 mr-1" /> Set up MFA
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Password</Label>
                <p className="text-sm text-muted-foreground">
                  Change your password or reset it if forgotten
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handlePasswordChange}>
                <KeyRound className="h-4 w-4 mr-1" /> Change
              </Button>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-700">Password Security Tips</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Use at least 12 characters</li>
                      <li>Mix uppercase, lowercase, numbers, and symbols</li>
                      <li>Don't reuse passwords from other sites</li>
                      <li>Consider using a password manager</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={preferences.emailNotifications}
              onCheckedChange={() => handlePreferenceChange("emailNotifications")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketingEmails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive promotional emails and special offers
              </p>
            </div>
            <Switch
              id="marketingEmails"
              checked={preferences.marketingEmails}
              onCheckedChange={() => handlePreferenceChange("marketingEmails")}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="activityUpdates">Activity Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about activity related to your content
              </p>
            </div>
            <Switch
              id="activityUpdates"
              checked={preferences.activityUpdates}
              onCheckedChange={() => handlePreferenceChange("activityUpdates")}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>
            Customize how the application looks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode
              </p>
            </div>
            <Switch
              id="darkMode"
              checked={preferences.darkMode}
              onCheckedChange={() => handlePreferenceChange("darkMode")}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription>
            Actions here cannot be easily undone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-red-200 rounded-md p-4 bg-red-50">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-medium text-red-800">Delete Account</h3>
                <p className="text-sm text-red-600 mt-1">
                  This will permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto"
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
