
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { BookProvider } from "@/context/BookContext";
import { CartProvider } from "@/context/CartContext";
import { DraftsProvider } from "@/context/DraftsContext";
import Index from "./pages/Index";
import CreateBook from "./pages/CreateBook";
import OrderConfirmation from "./pages/OrderConfirmation";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogAdmin from "./pages/BlogAdmin";
import NotFound from "./pages/NotFound";
import MFASetup from "./pages/MFASetup";
import Downloads from "./pages/Downloads"; // New import

// Account Pages
import AccountLayout from "./components/account/AccountLayout";
import ProfileOverview from "./components/account/ProfileOverview";
import SavedDraftsSection from "./components/account/SavedDraftsSection";
import SavedCartsSection from "./components/account/SavedCartsSection";
import FamilyDetails from "./components/account/FamilyDetails";
import AccountSettings from "./components/account/AccountSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookProvider>
        <CartProvider>
          <DraftsProvider onLoadDraft={(draft) => {}}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/create" element={<CreateBook />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/blog-admin" element={<BlogAdmin />} />
                  <Route path="/mfa-setup" element={<MFASetup />} />
                  <Route path="/downloads" element={<Downloads />} />
                  
                  {/* Account Routes */}
                  <Route path="/profile" element={<AccountLayout />}>
                    <Route index element={<ProfileOverview />} />
                    <Route path="drafts" element={<SavedDraftsSection />} />
                    <Route path="saved-carts" element={<SavedCartsSection />} />
                    <Route path="family" element={<FamilyDetails />} />
                    <Route path="settings" element={<AccountSettings />} />
                  </Route>
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </DraftsProvider>
        </CartProvider>
      </BookProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
