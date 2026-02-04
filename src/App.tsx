import { useState, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PostList } from "./components/PostList";
import { PostDetail } from "./components/PostDetail";
import { CategoryList } from "./components/CategoryList";
import { posts as initialPosts } from "./data/posts";
import type { Post, Comment } from "./types";

function App() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(
    initialPosts[0],
  );
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastCommenter, setLastCommenter] = useState<string | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(initialPosts.map((p) => p.category)));
  }, []);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return initialPosts;
    return initialPosts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleAddComment = (data: { user: string; text: string }) => {
    if (!selectedPost) return;

    const newComment: Comment = {
      id: Date.now(),
      postId: selectedPost.id,
      user: data.user,
      text: data.text,
      date: new Date().toLocaleDateString(),
    };

    setComments((prev) => ({
      ...prev,
      [selectedPost.id]: [...(prev[selectedPost.id] || []), newComment],
    }));

    setLastCommenter(data.user);
  };

  const handleNavigate = (
    view: "home" | "posts" | "categories" | "about" | "contact",
  ) => {
    switch (view) {
      case "home":
        setSelectedPost(initialPosts[0]);
        setSelectedCategory(null);
        break;
      case "posts":
        setSelectedPost(null); // Show list view/reset
        setSelectedCategory(null);
        break;
      case "categories":
        setSelectedPost(null); // Ensure sidebar is visible
        break;
      case "about":
        setSelectedPost(null);
        setSelectedCategory(null);
        break;
      case "contact":
        setSelectedPost(null);
        break;
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar onNavigate={handleNavigate} />

      <Hero />

      <main
        className="container"
        style={{ padding: "0", flex: 1, marginBottom: "4rem" }}
      >
        <div className="layout-grid">
          {/* Left Column: Recent Posts */}
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                {selectedCategory
                  ? `${selectedCategory} Articles`
                  : "Recent Posts"}
              </h2>
              <PostList posts={filteredPosts} onSelectPost={setSelectedPost} />
            </div>
          </div>

          {/* Right Column: Sidebar (Selected Post or Widgets) */}
          <aside
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* Selected Post View */}
            <div
              style={{
                backgroundColor: "var(--surface)",
                padding: "1.5rem",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "0.5rem",
                }}
              >
                {selectedPost ? "Selected Post" : "About"}
              </h3>

              {selectedPost ? (
                <PostDetail
                  post={selectedPost}
                  comments={comments[selectedPost.id] || []}
                  onAddComment={handleAddComment}
                  onBack={() => setSelectedPost(null)}
                />
              ) : (
                <div style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
                  <p>
                    Welcome to DevPulse. Select a post from the list to read
                    more details and leave comments.
                  </p>
                  <br />
                  <p>
                    This blog attempts to demonstrate modern React patterns
                    including State, Props, and Forms.
                  </p>
                </div>
              )}
            </div>

            {/* Categories Widget */}
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </aside>
        </div>
      </main>

      <footer
        style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--border)",
          padding: "2rem 0",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        <p>&copy; 2026 DevPulse Blog. Built with React & TypeScript.</p>
        {lastCommenter && (
          <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            👋 Thanks for contributing, {lastCommenter}!
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;
