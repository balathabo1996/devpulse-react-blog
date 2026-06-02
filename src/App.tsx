import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Sparkles, Briefcase, Cloud, Wrench, Shield, BookOpen, LayoutGrid } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PostList } from "./components/PostList";
import { PostDetail } from "./components/PostDetail";
import { PostFullDetail } from "./components/PostFullDetail";
import { CategoryList } from "./components/CategoryList";
import { Contact } from "./components/Contact";
import { About } from "./components/About";
import { CategorySection } from "./components/CategorySection";
import { Login } from "./components/Login";
import { AdminDashboard } from "./components/AdminDashboard";
import { Settings } from "./components/Settings";
import { Footer } from "./components/Footer";
import { usePosts, useCategories } from "./hooks/usePosts";
import { useComments } from "./hooks/useComments";
import type { Post } from "./types";

// Main Application Component: Manages state, routing, and layout.
function App() {
  const [view, setView] = useState<
    "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings"
  >(() => {
    const saved = localStorage.getItem("app_view");
    const validViews = ["home", "posts", "about", "contact", "login", "admin", "settings"];
    return validViews.includes(saved || "")
      ? (saved as "home" | "posts" | "about" | "contact" | "login" | "admin")
      : "home";
  });

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { comments, addComment } = useComments(selectedPost?.id || null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(() =>
    localStorage.getItem("app_category"),
  );

  const [searchQuery, setSearchQuery] = useState("");

  const { posts, loading, hasMore, loadMore, likePost, viewPost } = usePosts(
    selectedCategory,
    searchQuery,
  );
  const categories = useCategories();

  useEffect(() => {
    localStorage.setItem("app_view", view);
  }, [view]);

  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem("app_category", selectedCategory);
    } else {
      localStorage.removeItem("app_category");
    }
  }, [selectedCategory]);

  const handleAddComment = async (data: { user: string; text: string }) => {
    if (!selectedPost) return;
    try {
      await addComment(data.text);
    } catch (err) {
      alert("Please login to comment!");
    }
  };

  const handleNavigate = (
    viewName: "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings",
    reset?: boolean,
  ) => {
    setView(viewName);
    if (reset) {
      setSelectedCategory(null);
      setSelectedPost(null);
      setSearchQuery("");
      return;
    }
    switch (viewName) {
      case "home":
      case "posts":
      case "about":
      case "contact":
      case "login":
      case "admin":
        setSelectedPost(null);
        if (viewName !== "posts") {
          setSelectedCategory(null);
        }
        break;
    }
  };

  const getPageTitle = () => {
    if (selectedPost) return `${selectedPost.title} - DevPulse`;
    if (view === "about") return "About - DevPulse";
    if (view === "contact") return "Contact Us - DevPulse";
    if (view === "login") return "Login - DevPulse";
    if (view === "admin") return "Admin Dashboard - DevPulse";
    if (selectedCategory) return `${selectedCategory} Articles - DevPulse`;
    if (searchQuery) return `Search: ${searchQuery} - DevPulse`;
    return "DevPulse - The Modern Developer Blog";
  };

  const LoadMoreButton = () => {
    if (!hasMore) return null;
    return (
      <div
        style={{ textAlign: "center", marginTop: "2rem", marginBottom: "2rem" }}
      >
        <button
          onClick={loadMore}
          className="btn btn-ghost"
          disabled={loading}
          style={{
            width: "100%",
            padding: "1rem",
            border: "1px solid var(--border-color)",
          }}
        >
          {loading ? (
            <Loader2 className="animate-spin" style={{ display: "inline" }} />
          ) : (
            "Load More Posts"
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="app-wrapper">
      {/* Dynamic Background Image */}
      {selectedPost && (
        <div
          className="dynamic-bg animate-fade-in"
          style={{ backgroundImage: `url(${selectedPost.imageUrl})` }}
        />
      )}
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta
          name="description"
          content={
            selectedPost
              ? selectedPost.excerpt
              : "DevPulse is a modern developer blog covering React, Node.js, and web development."
          }
        />
      </Helmet>
      <Navbar currentView={view} onNavigate={handleNavigate} />
      <Hero
        searchQuery={searchQuery}
        showSearch={view === "home" || view === "posts"}
        onSearch={(q) => {
          setSearchQuery(q);
          if (q && view !== "posts" && view !== "home") {
            setView("home");
            setSelectedPost(null);
            setSelectedCategory(null);
          }
        }}
      />
      <main className="container main-content">
        {view === "admin" ? (
          <AdminDashboard onNavigate={handleNavigate} />
        ) : view === "settings" ? (
          <Settings />
        ) : view === "login" ? (
          <Login onNavigate={handleNavigate} />
        ) : view === "contact" ? (
          <Contact />
        ) : view === "about" ? (
          <About />
        ) : view === "posts" ? (
          selectedPost ? (
            <PostFullDetail
              post={selectedPost}
              comments={comments}
              onAddComment={handleAddComment}
              onLike={likePost}
              onView={viewPost}
              onBack={() => setSelectedPost(null)}
            />
          ) : (
            <div className="layout-grid">
              <div className="widget widget-full-width">
                <h1 className="hero-title hero-title-large">
                  {selectedCategory ? (
                    <>
                      <span className="text-gradient">{selectedCategory}</span>{" "}
                      Posts
                    </>
                  ) : (
                    <>
                      All <span className="text-gradient">Posts</span>
                    </>
                  )}
                </h1>

                <div className="category-filter-container">
                  <button
                    className={`filter-chip ${!selectedCategory ? "active" : ""}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    <LayoutGrid size={16} className="filter-chip-icon" />
                    <span>All</span>
                  </button>
                  {categories.map((cat) => {
                    const iconMap: Record<string, React.ReactNode> = {
                      "AI": <Sparkles size={16} className="filter-chip-icon" />,
                      "Career": <Briefcase size={16} className="filter-chip-icon" />,
                      "Cloud": <Cloud size={16} className="filter-chip-icon" />,
                      "Engineering": <Wrench size={16} className="filter-chip-icon" />,
                      "Security": <Shield size={16} className="filter-chip-icon" />,
                      "Tutorials": <BookOpen size={16} className="filter-chip-icon" />,
                    };
                    return (
                      <button
                        key={cat}
                        className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {iconMap[cat]}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="post-list-wrapper-max-width">
                  <PostList
                    posts={posts}
                    onSelect={(post) => {
                      setSelectedPost(post);
                      window.scrollTo(0, 0);
                    }}
                  />
                  {posts.length === 0 && !loading && (
                    <p
                      style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        padding: "2rem",
                      }}
                    >
                      No posts found.
                    </p>
                  )}
                  <LoadMoreButton />
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="layout-grid">
            <div>
              {!selectedCategory && !searchQuery ? (
                <>
                  {categories.map((cat) => (
                    <CategorySection
                      key={cat}
                      category={cat}
                      onSelectPost={(post) => {
                        setSelectedPost(post);
                        setView("posts");
                        window.scrollTo(0, 0);
                      }}
                      onViewCategory={(c) => {
                        setSelectedCategory(c);
                        window.scrollTo(0, 0);
                      }}
                    />
                  ))}
                  {categories.length === 0 && !loading && (
                    <p
                      style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        padding: "2rem",
                      }}
                    >
                      No categories found.
                    </p>
                  )}
                </>
              ) : (
                <div className="section-header">
                  <h2 className="section-title">
                    {searchQuery
                      ? `Search Results`
                      : `${selectedCategory} Articles`}
                  </h2>
                  <PostList
                    posts={posts}
                    onSelect={(post) => {
                      setSelectedPost(post);
                      setView("posts");
                      window.scrollTo(0, 0);
                    }}
                  />
                  {posts.length === 0 && !loading && (
                    <p
                      style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        padding: "2rem",
                      }}
                    >
                      No posts found.
                    </p>
                  )}
                  <LoadMoreButton />
                </div>
              )}
            </div>
            <aside className="sidebar">
              <div className="widget">
                <h3 className="widget-title">About</h3>
                <div className="widget-empty">
                  <p>
                    Welcome to DevPulse. Click on any post to read the full
                    article and leave comments.
                  </p>
                  <br />
                  <p>
                    This blog is now real-time! Try opening it in multiple tabs.
                  </p>
                </div>
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
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
