
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, Image, Save } from "lucide-react";

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

interface BlogPostEditorProps {
  post: BlogPost;
  isNew?: boolean;
  onSaved: () => void;
  onCancel: () => void;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ 
  post, 
  isNew = false,
  onSaved,
  onCancel
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<BlogPost>(post);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(post.featured_image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState("edit");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    setFormData(post);
    setPreviewImage(post.featured_image);
  }, [post]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      is_published: checked,
      published_at: checked && !prev.published_at ? new Date().toISOString() : prev.published_at
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    setImageFile(file);
    
    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    
    // No need to update formData.featured_image yet - will do that after upload
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.slug?.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
    }
    
    if (!formData.content?.trim()) {
      newErrors.content = "Content is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.featured_image;
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.message || 'Error uploading image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) return;
    
    try {
      setLoading(true);
      
      // If we have a new image, upload it first
      let imageUrl = formData.featured_image;
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      
      const now = new Date().toISOString();
      const updatedPost = {
        ...formData,
        featured_image: imageUrl,
        updated_at: now,
        author_id: user.id
      };
      
      let response;
      
      if (isNew) {
        // Create new post
        response = await supabase
          .from('blog_posts')
          .insert([updatedPost])
          .select()
          .single();
      } else {
        // Update existing post
        response = await supabase
          .from('blog_posts')
          .update(updatedPost)
          .eq('id', formData.id)
          .select()
          .single();
      }
      
      if (response.error) throw response.error;
      
      toast.success(isNew ? "Post created successfully" : "Post updated successfully");
      onSaved();
      
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(error.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-');     // Remove consecutive hyphens
      
    setFormData(prev => ({ ...prev, slug }));
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isNew ? "Create New Post" : "Edit Post"}</CardTitle>
        </CardHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <div className="px-6">
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="edit">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Post title"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="slug">Slug</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={generateSlug}
                    className="text-xs h-6"
                  >
                    Generate from title
                  </Button>
                </div>
                <Input 
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="post-url-slug"
                  className={errors.slug ? "border-red-500" : ""}
                />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                <Textarea 
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt || ""}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the post"
                  className="resize-none h-20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content"
                  name="content"
                  value={formData.content || ""}
                  onChange={handleInputChange}
                  placeholder="Write your post content here..."
                  className={`resize-none h-64 ${errors.content ? "border-red-500" : ""}`}
                />
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                <div className="flex items-center space-x-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {previewImage ? "Change Image" : "Upload Image"}
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                
                {previewImage && (
                  <div className="mt-4">
                    <img 
                      src={previewImage} 
                      alt="Featured image preview" 
                      className="max-h-48 rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex items-center space-x-2">
                <Switch 
                  id="published"
                  checked={!!formData.is_published}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="published">Publish post</Label>
              </div>
              
              {formData.is_published && formData.published_at && (
                <div className="text-sm text-muted-foreground">
                  Published on {new Date(formData.published_at).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="preview">
            <CardContent className="prose max-w-none">
              <h1 className="text-3xl font-bold mb-4">{formData.title || "Post Title"}</h1>
              
              {previewImage && (
                <img 
                  src={previewImage} 
                  alt={formData.title} 
                  className="w-full h-64 object-cover rounded-md mb-6"
                />
              )}
              
              {formData.excerpt && (
                <div className="bg-muted p-4 rounded-md mb-6 italic">
                  {formData.excerpt}
                </div>
              )}
              
              <div className="whitespace-pre-wrap">
                {formData.content || "No content to preview"}
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Save Post</span>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BlogPostEditor;
