
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit, Trash2, Plus, File, Search, Save } from "lucide-react";
import BlogPostEditor from "@/components/blog/BlogPostEditor";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  published_at: string | null;
  is_published: boolean | null;
  created_at: string;
  updated_at: string;
  author_id: string;
}

const BlogAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Check if user has admin role
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        // For Clerk integration, we'll check admin status from Supabase
        // This can be adapted to use Clerk's roles system if implemented
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'admin');
        
        const hasAdminRole = data && data.length > 0;
        
        setIsAdmin(hasAdminRole);
        if (!hasAdminRole) {
          toast.error("You don't have permission to access this page");
          navigate("/");
        } else {
          fetchPosts();
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("updated_at", { ascending: false });
        
      if (error) throw error;
      
      setPosts(data || []);
    } catch (err: any) {
      console.error("Error fetching blog posts:", err);
      toast.error(err.message || "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const createNewPost = () => {
    if (!user) return;
    
    const newPost = {
      id: "",
      title: "New Post",
      slug: "new-post-" + Date.now(),
      excerpt: "",
      content: "",
      featured_image: null,
      published_at: null,
      is_published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_id: user.id
    };
    
    setSelectedPost(newPost);
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const { error } = await supabase
          .from("blog_posts")
          .delete()
          .eq("id", postId);
          
        if (error) throw error;
        
        toast.success("Post deleted successfully");
        fetchPosts();
        
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to delete post");
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (post.excerpt?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "published") return matchesSearch && post.is_published;
    if (activeTab === "drafts") return matchesSearch && !post.is_published;
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-book-red" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // User will be redirected in useEffect
  }

  return (
    <>
      <Helmet>
        <title>Blog Admin | Little Origins Books</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Blog Admin</h1>
          <Button onClick={() => navigate("/blog")}>
            View Blog
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar with post list */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Posts</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={createNewPost}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" /> New
                  </Button>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                  />
                </div>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="published">Published</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent>
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No posts match your search" : "No posts found"}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredPosts.map((post) => (
                        <div 
                          key={post.id} 
                          className={`p-3 rounded-md border cursor-pointer transition-colors ${
                            selectedPost?.id === post.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedPost(post)}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate flex-1">{post.title}</h3>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePost(post.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <File className="h-3 w-3 mr-1" />
                            <span className="mr-2">{post.slug}</span>
                            
                            <span 
                              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                post.is_published 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {post.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side editor */}
          <div className="md:col-span-2">
            {selectedPost ? (
              <BlogPostEditor 
                post={selectedPost} 
                isNew={!selectedPost.id}
                onSaved={fetchPosts}
                onCancel={() => setSelectedPost(null)}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Post Selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a post to edit or create a new one
                  </p>
                  <Button onClick={createNewPost}>
                    <Plus className="h-4 w-4 mr-2" /> Create New Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogAdmin;
