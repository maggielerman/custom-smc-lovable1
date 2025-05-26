
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Users, Plus, X } from "lucide-react";
import { getSafeSupabaseId } from "@/lib/auth/clerk-helpers";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthdate?: string;
}

export default function FamilyDetails() {
  const { user, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingStory, setLoadingStory] = useState(true);
  const [savingStory, setSavingStory] = useState(false);
  
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyStory, setFamilyStory] = useState("");
  
  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "",
    birthdate: "",
  });

  // Convert Clerk userId to Supabase compatible UUID
  const getSupabaseUserId = () => {
    if (!userId) return null;
    return getSafeSupabaseId(userId);
  };

  // Load family members from database
  useEffect(() => {
    async function loadFamilyMembers() {
      if (!userId) return;

      try {
        setLoading(true);
        const supabaseUserId = getSupabaseUserId();
        if (!supabaseUserId) {
          console.error("Failed to get Supabase user ID");
          toast.error("Failed to load family members");
          return;
        }
        
        const { data, error } = await supabase
          .from('family_members')
          .select('*')
          .eq('user_id', supabaseUserId);

        if (error) {
          console.error("Error loading family members:", error);
          toast.error("Failed to load family members");
        } else {
          console.log("Loaded family members:", data);
          setFamilyMembers(data || []);
        }
      } catch (error) {
        console.error("Exception loading family members:", error);
        toast.error("An error occurred while loading family members");
      } finally {
        setLoading(false);
      }
    }

    loadFamilyMembers();
  }, [userId]);

  // Load family story from database
  useEffect(() => {
    async function loadFamilyStory() {
      if (!userId) return;

      try {
        setLoadingStory(true);
        const supabaseUserId = getSupabaseUserId();
        if (!supabaseUserId) {
          console.error("Failed to get Supabase user ID");
          toast.error("Failed to load family story");
          return;
        }
        
        const { data, error } = await supabase
          .from('family_stories')
          .select('story')
          .eq('user_id', supabaseUserId)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error("Error loading family story:", error);
            toast.error("Failed to load family story");
          }
        } else if (data) {
          console.log("Loaded family story:", data);
          setFamilyStory(data.story);
        }
      } catch (error) {
        console.error("Exception loading family story:", error);
        toast.error("An error occurred while loading family story");
      } finally {
        setLoadingStory(false);
      }
    }

    loadFamilyStory();
  }, [userId]);

  const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewMember({
      ...newMember,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMember = async () => {
    if (!userId) {
      toast.error("Please log in to add family members");
      return;
    }

    if (!newMember.name || !newMember.relationship) {
      toast.error("Please provide at least a name and relationship");
      return;
    }
    
    try {
      setSaving(true);
      const supabaseUserId = getSupabaseUserId();
      if (!supabaseUserId) {
        toast.error("Error with user identification. Please try logging out and back in.");
        return;
      }
      
      const newMemberData = {
        user_id: supabaseUserId,
        name: newMember.name,
        relationship: newMember.relationship,
        birthdate: newMember.birthdate || null
      };
      
      const { data, error } = await supabase
        .from('family_members')
        .insert(newMemberData)
        .select();

      if (error) {
        console.error("Error saving family member:", error);
        toast.error("Failed to save family member");
        return;
      }

      console.log("Added family member:", data);
      
      // Add the new member to the local state with the returned ID
      const savedMember = data[0];
      setFamilyMembers([...familyMembers, savedMember]);
      
      // Reset the form
      setNewMember({
        name: "",
        relationship: "",
        birthdate: "",
      });
      
      toast.success("Family member added");
    } catch (error) {
      console.error("Exception adding family member:", error);
      toast.error("An error occurred while adding family member");
    } finally {
      setSaving(false);
    }
  };
  
  const handleRemoveMember = async (id: string) => {
    if (!userId) {
      toast.error("Please log in to remove family members");
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error removing family member:", error);
        toast.error("Failed to remove family member");
        return;
      }

      // Update local state
      setFamilyMembers(familyMembers.filter(member => member.id !== id));
      toast.success("Family member removed");
    } catch (error) {
      console.error("Exception removing family member:", error);
      toast.error("An error occurred while removing family member");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFamilyStory = async () => {
    if (!userId) {
      toast.error("Please log in to save your family story");
      return;
    }

    if (!familyStory.trim()) {
      toast.error("Please enter your family story");
      return;
    }

    try {
      setSavingStory(true);
      const supabaseUserId = getSupabaseUserId();
      if (!supabaseUserId) {
        toast.error("Error with user identification. Please try logging out and back in.");
        return;
      }
      
      // First check if a story already exists
      const { data: existingStory } = await supabase
        .from('family_stories')
        .select('id')
        .eq('user_id', supabaseUserId)
        .single();
        
      let result;
      
      if (existingStory) {
        // Update existing story
        result = await supabase
          .from('family_stories')
          .update({ story: familyStory, updated_at: new Date().toISOString() })
          .eq('user_id', supabaseUserId);
      } else {
        // Insert new story
        result = await supabase
          .from('family_stories')
          .insert({
            user_id: supabaseUserId,
            story: familyStory
          });
      }
      
      if (result.error) {
        console.error("Error saving family story:", result.error);
        toast.error("Failed to save family story");
        return;
      }
      
      toast.success("Family story saved");
    } catch (error) {
      console.error("Exception saving family story:", error);
      toast.error("An error occurred while saving family story");
    } finally {
      setSavingStory(false);
    }
  };

  const handleFamilyStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFamilyStory(e.target.value);
  };

  if (loading && loadingStory) {
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
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" /> Family Details
          </CardTitle>
          <CardDescription>
            Add information about your family members to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {familyMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No family members added yet</p>
              <p className="text-sm mt-2">Add your family members to personalize your books</p>
            </div>
          ) : (
            <div className="space-y-4">
              {familyMembers.map(member => (
                <div 
                  key={member.id} 
                  className="p-4 border rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.relationship}</p>
                    {member.birthdate && (
                      <p className="text-xs text-gray-500">Born: {member.birthdate}</p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={saving}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Add Family Member</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={newMember.name}
                    onChange={handleNewMemberChange}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input 
                    id="relationship"
                    name="relationship"
                    value={newMember.relationship}
                    onChange={handleNewMemberChange}
                    placeholder="E.g., Child, Partner, Parent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthdate">Birthdate (Optional)</Label>
                <Input 
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  value={newMember.birthdate}
                  onChange={handleNewMemberChange}
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddMember}
                className="bg-book-red hover:bg-red-700 text-white"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" /> Add Family Member
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Family Story</CardTitle>
          <CardDescription>
            Share your family's journey (this will help personalize your experience)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="familyStory">Your Family's Story</Label>
              <Textarea 
                id="familyStory"
                placeholder="Share your family's journey, how it was formed, and what makes it special..."
                rows={5}
                value={familyStory}
                onChange={handleFamilyStoryChange}
              />
              <p className="text-sm text-muted-foreground">
                This information helps us personalize your book creation experience
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="bg-book-red hover:bg-red-700 text-white"
            disabled={savingStory}
            onClick={handleSaveFamilyStory}
          >
            {savingStory ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Saving...
              </>
            ) : (
              "Save Family Story"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
