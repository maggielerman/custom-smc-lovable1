
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, featured_image, published_at")
          .eq("is_published", true)
          .order("published_at", { ascending: false });
          
        if (error) throw error;
        
        setPosts(data || []);
      } catch (err: any) {
        console.error("Error fetching blog posts:", err);
        setError(err.message || "Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog | Little Origins Books</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Our Blog</h1>
          <p className="text-lg text-gray-600 mb-12">
            Explore articles about fertility, family journeys, and talking to children about their origins
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-book-red" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-6 rounded-lg text-center">
              <p className="mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
              <p className="text-gray-500">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link 
                  to={`/blog/${post.slug}`} 
                  key={post.id}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-all group-hover:shadow-md">
                    {post.featured_image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-sm text-gray-500 mb-2">
                        {post.published_at 
                          ? new Date(post.published_at).toLocaleDateString('en-US', {
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric'
                            })
                          : "Draft"}
                      </p>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-book-red">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <p className="mt-4 text-book-red font-medium group-hover:underline">
                        Read more
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
