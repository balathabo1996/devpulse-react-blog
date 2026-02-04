import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PostList } from "./components/PostList";
import { PostDetail } from "./components/PostDetail";
import { PostFullDetail } from "./components/PostFullDetail";
import { CategoryList } from "./components/CategoryList";
import { Contact } from "./components/Contact";
import { About } from "./components/About";
import { Categories } from "./components/Categories";
import { posts as initialPosts } from "./data/posts";
import type { Post, Comment } from "./types";

/** Main Application Component: Manages state, routing, and layout. */
function App() {
  const [view, setView] = useState<
    "home" | "posts" | "categories" | "about" | "contact"
  >("home");
  const [posts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(posts[0]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastCommenter, setLastCommenter] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category))),
    [posts],
  );
  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query),
      );
    }

    return result;
  }, [posts, selectedCategory, searchQuery]);

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
    viewName: "home" | "posts" | "categories" | "about" | "contact",
    reset?: boolean,
  ) => {
    setView(viewName);
    if (reset) {
      setSelectedCategory(null);
      setSelectedPost(null);
      setSearchQuery(""); // Clear search on explicit reset
      return;
    }
    // Case logic for internal navigation (e.g. from Categories to Posts) without reset
    switch (viewName) {
      case "home":
        setSelectedPost(null);
        setSelectedCategory(null);
        break;
      case "posts":
        setSelectedPost(null);
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
        break;
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar onNavigate={handleNavigate} />
      <Hero
        searchQuery={searchQuery}
        onSearch={(q) => {
          setSearchQuery(q);
          if (q && view !== "posts") {
            // If searching from other views, switch to home list view to show results
            if (view !== "home") {
              setView("home");
              setSelectedPost(null);
              setSelectedCategory(null);
              // Do NOT clear searchQuery here
            }
          }
        }}
      />
      <main className="container main-content">
        {view === "contact" ? (
          <Contact />
        ) : view === "about" ? (
          <About />
        ) : view === "categories" ? (
          <Categories
            categories={categories}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              handleNavigate("posts"); // Redirect to posts view filtered by category
            }}
          />
        ) : view === "posts" ? (
          // Full Page Layout for 'Posts' tab
          selectedPost ? (
            <PostFullDetail
              post={selectedPost}
              comments={comments[selectedPost.id] || []}
              onAddComment={handleAddComment}
              onBack={() => setSelectedPost(null)}
            />
          ) : (
            <div className="layout-grid">
              <div className="widget" style={{ gridColumn: "1 / -1" }}>
                <h1
                  className="hero-title"
                  style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}
                >
                  {selectedCategory ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        onClick={() => handleNavigate("categories")}
                        className="btn btn-ghost"
                        style={{
                          alignSelf: "flex-start",
                          paddingLeft: 0,
                          color: "var(--text-muted)",
                          fontSize: "1rem",
                          fontWeight: "normal",
                        }}
                      >
                        <ArrowLeft
                          size={16}
                          style={{ display: "inline", marginRight: "0.5rem" }}
                        />{" "}
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
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                  <PostList
                    posts={filteredPosts}
                    onSelect={(post) => {
                      setSelectedPost(post);
                      window.scrollTo(0, 0); // Scroll to top when opening a post
                    }}
                  />
                </div>
              </div>
            </div>
          )
        ) : (
          // Default Home Layout (Split View)
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
        )}
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
