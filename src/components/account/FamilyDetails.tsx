
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

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthdate?: string;
}

export default function FamilyDetails() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // This is a placeholder for family data
  // In a real implementation, we'd store this in a family_members table
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "",
    birthdate: "",
  });

  useEffect(() => {
    // This is where we'd fetch family members from the database
    // For now, just simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewMember({
      ...newMember,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relationship) {
      toast.error("Please provide at least a name and relationship");
      return;
    }
    
    const member: FamilyMember = {
      id: crypto.randomUUID(),
      name: newMember.name,
      relationship: newMember.relationship,
    };
    
    if (newMember.birthdate) {
      member.birthdate = newMember.birthdate;
    }
    
    setFamilyMembers([...familyMembers, member]);
    setNewMember({
      name: "",
      relationship: "",
      birthdate: "",
    });
    
    toast.success("Family member added");
  };
  
  const handleRemoveMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
    toast.success("Family member removed");
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
              >
                <Plus className="h-4 w-4 mr-2" /> Add Family Member
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
            disabled={saving}
          >
            {saving ? (
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
