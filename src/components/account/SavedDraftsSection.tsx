
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDrafts } from "@/context/DraftsContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Trash2, PlusCircle } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";

export default function SavedDraftsSection() {
  const { user } = useAuth();
  const { savedDrafts, loadDraft, deleteDraft, loadingSavedDrafts, fetchSavedDrafts } = useDrafts();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSavedDrafts();
    }
  }, [user, fetchSavedDrafts]);

  const handleLoadDraft = (draftIndex: number) => {
    const draft = savedDrafts[draftIndex];
    loadDraft(draft);
    navigate("/create");
  };

  const handleDeleteDraft = async (draftId: string) => {
    await deleteDraft(draftId);
  };

  if (loadingSavedDrafts) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-book-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Your Saved Drafts</h3>
        <Button 
          onClick={() => navigate("/create")} 
          variant="outline" 
          className="border-book-red text-book-red hover:bg-book-red/10"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Book
        </Button>
      </div>

      {savedDrafts.length === 0 ? (
        <Card className="mb-8 bg-muted/40">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">You don't have any saved drafts yet.</p>
            <Button 
              onClick={() => navigate("/create")} 
              className="bg-book-red hover:bg-red-700 text-white"
            >
              Start Creating a Book
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {savedDrafts.map((draft, index) => (
            <Card key={draft.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-book-red/10 to-soft-blue/10 pb-4">
                <CardTitle className="line-clamp-1">{draft.title}</CardTitle>
                <CardDescription>
                  {new Date(draft.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-4">
                <div className="space-y-2 text-sm">
                  {draft.child_name && (
                    <p><span className="font-medium">Child's Name:</span> {draft.child_name}</p>
                  )}
                  <p>
                    <span className="font-medium">Family:</span> {" "}
                    {draft.family_structure === "hetero-couple" ? "Two Parents (Mom & Dad)" : 
                     draft.family_structure === "single-mom" ? "Single Mom" : 
                     draft.family_structure === "single-dad" ? "Single Dad" : 
                     draft.family_structure === "two-moms" ? "Two Moms" : 
                     "Two Dads"}
                  </p>
                  <p>
                    <span className="font-medium">Conception:</span> {" "}
                    {draft.conception_type === "ivf" ? "IVF" : 
                     draft.conception_type === "iui" ? "IUI" : 
                     draft.conception_type === "donor-egg" ? "Donor Egg" : 
                     draft.conception_type === "donor-sperm" ? "Donor Sperm" : 
                     "Donor Embryo"}
                  </p>
                </div>
                
                <div className="flex justify-between mt-auto pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleLoadDraft(index)}
                    className="text-book-red hover:text-book-red/80 hover:bg-book-red/10"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this book draft? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
