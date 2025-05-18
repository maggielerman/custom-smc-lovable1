
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { clerkToSupabaseId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Edit } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  author_id: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          throw new Error("Post not found");
        }
        
        setPost(data);

        // Check if user is admin
        if (user) {
          const supabaseUserId = clerkToSupabaseId(user.id);
          const { data: isAdminData, error: adminError } = await supabase
            .rpc('has_role', { _user_id: supabaseUserId, _role: 'admin' });
          
          if (!adminError) {
            setIsAdmin(!!isAdminData);
          }
        }
      } catch (err: any) {
        console.error("Error fetching blog post:", err);
        setError(err.message || "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-book-red" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Little Origins Books Blog</title>
        {post.excerpt && <meta name="description" content={post.excerpt} />}
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" asChild>
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
                </Link>
              </Button>
              
              {isAdmin && (
                <Button variant="outline" asChild>
                  <Link to="/blog-admin">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Link>
                </Button>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
            
            {post.published_at && (
              <p className="text-gray-500 mb-6">
                Published on {new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            
            {post.featured_image && (
              <div className="mb-8">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            
            {post.excerpt && (
              <div className="bg-gray-50 border-l-4 border-book-red p-4 italic text-gray-700 mb-8">
                {post.excerpt}
              </div>
            )}
            
            <article className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
