
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, BookOpen, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clerkToSupabaseId } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClerkUserProfile from "./ClerkUserProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string | null;
  clerk_id: string | null;
}

export default function ProfileOverview() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const supabaseUserId = clerkToSupabaseId(user.id);
        console.log("Fetching profile for user ID:", user.id);
        console.log("Using Supabase user ID:", supabaseUserId);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUserId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile:", error);
          throw error;
        }
        
        // If profile exists, use it
        if (data) {
          console.log("Profile found:", data);
          setProfileData(data);
          setFormData({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
          });
        } 
        // If no profile exists yet for the Clerk user, create one
        else {
          console.log("No profile found, creating new profile");
          const firstName = user.firstName || "";
          const lastName = user.lastName || "";
          const primaryEmail = user.emailAddresses?.find((email: any) => 
            email.id === user.primaryEmailAddressId
          )?.emailAddress || user.email || null;
          
          // Create new profile in Supabase
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: supabaseUserId,
              first_name: firstName,
              last_name: lastName,
              email: primaryEmail,
              clerk_id: user.id,
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating profile:", createError);
            toast.error("Failed to create user profile");
            throw createError;
          }
          
          console.log("Created new profile:", newProfile);
          setProfileData(newProfile);
          setFormData({
            firstName: firstName,
            lastName: lastName,
          });
        }
      } catch (error: any) {
        console.error("Error in profile fetch/create:", error);
        toast.error(error.message || "Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setUpdating(true);
      const supabaseUserId = clerkToSupabaseId(user.id);
      
      // Update Supabase profile
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName || null,
          last_name: formData.lastName || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', supabaseUserId);

      if (error) {
        console.error("Error updating profile in Supabase:", error);
        throw error;
      }
      
      // Also update Clerk user metadata if available
      try {
        await user.update({
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined
        });
        console.log("Clerk profile updated successfully");
      } catch (clerkError) {
        console.error("Failed to update Clerk profile:", clerkError);
        // Continue with the flow even if Clerk update fails
      }
      
      toast.success("Profile updated successfully");
      
      // Update local state
      setProfileData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          first_name: formData.firstName || null,
          last_name: formData.lastName || null,
        };
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-book-red" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "basic" | "advanced")} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="basic" className="flex-1">Basic Profile</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">Advanced Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  Manage your account information
                </CardDescription>
              </div>
              {profileData?.avatar_url && (
                <Avatar className="h-16 w-16 border-2 border-gray-200">
                  <AvatarImage src={profileData.avatar_url} alt="Profile" />
                  <AvatarFallback>{profileData.first_name?.[0]}{profileData.last_name?.[0]}</AvatarFallback>
                </Avatar>
              )}
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    value={profileData?.email || user?.emailAddresses?.[0]?.emailAddress || user?.email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-book-red hover:bg-red-700 text-white"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" /> Recent Books
                </CardTitle>
                <CardDescription>
                  Books you've recently created
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No books created yet</p>
                  <Button 
                    variant="link" 
                    className="mt-2 text-book-red"
                    onClick={() => navigate('/create')}
                  >
                    Create your first book
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" /> Recent Drafts
                </CardTitle>
                <CardDescription>
                  Book drafts you're working on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>View all your drafts</p>
                  <Button 
                    variant="link" 
                    className="mt-2 text-book-red"
                    onClick={() => navigate('/profile/drafts')}
                  >
                    View all drafts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <ClerkUserProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}
