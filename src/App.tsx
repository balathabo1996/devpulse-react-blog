import { useState, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PostList } from "./components/PostList";
import { PostDetail } from "./components/PostDetail";
import { CategoryList } from "./components/CategoryList";
import { posts as initialPosts } from "./data/posts";
import type { Post, Comment } from "./types";

/** Main Application Component: Manages state, routing, and layout. */
function App() {
  const [posts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(posts[0]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastCommenter, setLastCommenter] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category))),
    [posts],
  );
  const filteredPosts = useMemo(
    () =>
      selectedCategory
        ? posts.filter((p) => p.category === selectedCategory)
        : posts,
    [posts, selectedCategory],
  );

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
        setSelectedPost(posts[0]);
        setSelectedCategory(null);
        break;
      case "posts":
        setSelectedPost(null);
        setSelectedCategory(null);
        break;
      case "categories":
        setSelectedPost(null);
        break;
      case "about":
        setSelectedPost(null);
        setSelectedCategory(null);
        break; // Placeholder for About
      case "contact":
        setSelectedPost(null);
        break; // Placeholder for Contact
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar onNavigate={handleNavigate} />
      <Hero />
      <main className="container main-content">
        <div className="layout-grid">
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
              <PostList posts={filteredPosts} onSelect={setSelectedPost} />
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
                  onBack={() => setSelectedPost(null)}
                />
              ) : (
                <div className="widget-empty">
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
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </aside>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2026 DevPulse Blog. Built with React & TypeScript.</p>
        {lastCommenter && (
          <p className="footer-note">
            👋 Thanks for contributing, {lastCommenter}!
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;
