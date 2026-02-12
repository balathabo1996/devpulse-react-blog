import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { PostList } from "@/components/PostList";
import { posts as staticPosts } from "@/data/posts";
import type { Post } from "@/types";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { category } = router.query;

  const selectedCategory = typeof category === "string" ? category : null;

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();
        
        const CATEGORIES = ["Engineering", "AI", "Career", "Tutorials"];

        const mappedPosts: Post[] = data.slice(0, 6).map((p: any) => {
           const staticPost = staticPosts.find(sp => sp.id === p.id);
           if (staticPost) {
             return { ...staticPost, imageUrl: staticPost.imageUrl || `/images/post${(p.id % 4) + 1}.jpg` };
           }
           return {
            id: p.id,
            title: p.title,
            date: new Date().toLocaleDateString(), 
            excerpt: p.body.substring(0, 100) + "...",
            content: p.body,
            category: CATEGORIES[p.id % CATEGORIES.length],
            imageUrl: `/images/post${(p.id % 4) + 1}.jpg`,
          };
        });
        
        setPosts(mappedPosts);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    return result;
  }, [posts, selectedCategory]);

  const handleSelectPost = (post: Post) => {
    // In "Posts" view (Full Page), logic usually navigates to full detail page
    router.push(`/posts/${post.id}`);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem", textAlign: "center" }}>
        <h2 className="text-gradient" style={{ fontSize: "2rem" }}>Loading posts...</h2>
      </div>
    );
  }

  return (
    <div className="layout-grid">
      <div className="widget widget-full-width">
        <h1 className="hero-title hero-title-large">
          {selectedCategory ? (
            <div className="category-header">
              <button
                onClick={() => router.push("/categories")}
                className="btn btn-ghost btn-back-category"
              >
                <ArrowLeft size={16} className="icon-margin-right" />{" "}
                Back to Categories
              </button>
              <span>
                <span className="text-gradient">
                  {selectedCategory}
                </span>{" "}
                Posts
              </span>
            </div>
          ) : (
            <>
              All <span className="text-gradient">Posts</span>
            </>
          )}
        </h1>
        <div className="post-list-wrapper-max-width">
          <PostList
            posts={filteredPosts}
            onSelect={handleSelectPost}
          />
        </div>
      </div>
    </div>
  );
}
