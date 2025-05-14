
import { useState, useEffect } from "react";
import { useBookContext } from "@/context/BookContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Edit, PlusCircle, AlertCircle } from "lucide-react";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const SavedDrafts = () => {
  const { savedDrafts, loadDraft, deleteDraft, loadingSavedDrafts, fetchSavedDrafts, error } = useBookContext();
  const { user, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [errorShown, setErrorShown] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchSavedDrafts();
    }
  }, [isLoaded, user, fetchSavedDrafts]);

  // Handle error state without infinite toasts
  useEffect(() => {
    if (error && error !== errorShown) {
      // Only show error toast once per unique error message
      setErrorShown(error);
    } else if (!error) {
      setErrorShown(null);
    }
  }, [error, errorShown]);

  const handleLoadDraft = (draftIndex: number) => {
    const draft = savedDrafts[draftIndex];
    loadDraft(draft);
    navigate("/create");
  };

  const handleDeleteDraft = async (draftId: string) => {
    await deleteDraft(draftId);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-book-red" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Saved Drafts</CardTitle>
          <CardDescription>
            Sign in to view and manage your saved book drafts
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Button 
            onClick={() => navigate("/auth")} 
            className="bg-book-red hover:bg-red-700 text-white"
          >
            Sign In to Access
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loadingSavedDrafts) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-book-red" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Your Saved Drafts</h3>
        <Button 
          onClick={() => navigate("/create")} 
          variant="outline" 
          className="border-book-red text-book-red hover:bg-book-red/10"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Book
        </Button>
      </div>

      {/* Show error alert if there's an error */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchSavedDrafts()}
              disabled={loadingSavedDrafts}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {savedDrafts.length === 0 ? (
        <Card className="mb-8 bg-muted/40">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {error ? "Could not load your drafts" : "You don't have any saved drafts yet."}
            </p>
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
              <CardContent className="pt-4">
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
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
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
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default SavedDrafts;
