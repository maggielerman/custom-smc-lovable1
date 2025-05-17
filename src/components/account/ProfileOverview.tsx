
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

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export default function ProfileOverview() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfileData(data);
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
        });
      } catch (error: any) {
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
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName || null,
          last_name: formData.lastName || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
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
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Manage your account information
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                value={user?.email || ""}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}
