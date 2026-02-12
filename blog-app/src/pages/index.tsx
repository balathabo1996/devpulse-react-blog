import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostList } from "@/components/PostList";
import { CategoryList } from "@/components/CategoryList";
import { PostDetail } from "@/components/PostDetail";
import { posts as staticPosts } from "@/data/posts";
import type { Post } from "@/types";
import { useComments } from "@/context/CommentContext";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { q, category, previewId } = router.query;

  // Search query from URL
  const searchQuery = typeof q === "string" ? q : "";
  const selectedCategory = typeof category === "string" ? category : null;
  const selectedPostId =
    typeof previewId === "string" ? Number(previewId) : null;

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();

        const CATEGORIES = ["Engineering", "AI", "Career", "Tutorials"];

        // Limit to 6 posts to show expanded content
        const mappedPosts: Post[] = data.slice(0, 6).map((p: any) => {
          // Check if we have a static post override for this ID
          const staticPost = staticPosts.find((sp) => sp.id === p.id);
          if (staticPost) {
            return {
              ...staticPost,
              imageUrl:
                staticPost.imageUrl || `/images/post${(p.id % 4) + 1}.jpg`,
            };
          }

          // Fallback (shouldn't happen for first 4 if static data is complete)
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

  // Use fixed categories to ensure order matches original perfectly
  const categories = ["Engineering", "AI", "Career", "Tutorials"];

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQ) ||
          p.excerpt.toLowerCase().includes(lowerQ),
      );
    }

    return result;
  }, [posts, selectedCategory, searchQuery]);

  const selectedPost = useMemo(
    () => posts.find((p) => p.id === selectedPostId) || null,
    [posts, selectedPostId],
  );

  const handleSelectPost = (post: Post) => {
    // For Home View, we show preview in sidebar (Split View)
    // Update URL shallowly to persist state
    router.push(
      {
        pathname: "/",
        query: { ...router.query, previewId: post.id },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleSelectCategory = (cat: string | null) => {
    const query = { ...router.query };
    if (cat) {
      query.category = cat;
    } else {
      delete query.category;
    }
    // allow switching categories to keep preview? prefer clearing preview
    delete query.previewId;

    router.push({
      pathname: "/",
      query: query,
    });
  };

  const { comments, addComment } = useComments();

  const handleAddComment = (data: { user: string; text: string }) => {
    if (!selectedPostId) return;
    addComment(selectedPostId, data.user, data.text);
  };

  if (loading) {
    return (
      <div
        className="container"
        style={{ padding: "4rem", textAlign: "center" }}
      >
        <h2 className="text-gradient" style={{ fontSize: "2rem" }}>
          Loading posts...
        </h2>
      </div>
    );
  }

  return (
    <div className="layout-grid">
      <div>
        <div className="section-header">
          <h2 className="section-title">
            {selectedCategory ? (
              <>
                <span className="text-gradient">{selectedCategory}</span>{" "}
                Articles
                <button
                  onClick={() => handleSelectCategory(null)}
                  className="btn btn-ghost" // Inline simple reset
                  style={{ fontSize: "0.8rem", marginLeft: "1rem" }}
                >
                  (Clear Filter)
                </button>
              </>
            ) : searchQuery ? (
              <>Search Results for "{searchQuery}"</>
            ) : (
              "Recent Posts"
            )}
          </h2>
          <PostList posts={filteredPosts} onSelect={handleSelectPost} />
        </div>
      </div>
      <aside className="sidebar">
        <div className="widget">
          <h3 className="widget-title">
            {selectedPost ? "Selected Post" : "About"}
          </h3>
          {selectedPost ? (
            <PostDetail
              post={selectedPost}
              comments={comments[selectedPost.id] || []}
              onAddComment={handleAddComment}
              onBack={() => {
                const query = { ...router.query };
                delete query.previewId;
                router.push({ pathname: "/", query }, undefined, {
                  shallow: true,
                });
              }}
            />
          ) : (
            <div className="widget-empty">
              <p>
                Welcome to DevPulse. Select a post from the list to read more
                details and leave comments.
              </p>
              <br />
              <p>
                This blog attempts to demonstrate modern React patterns
                including State, Props, and Forms.
              </p>
            </div>
          )}
        </div>
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </aside>
    </div>
  );
}
