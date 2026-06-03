import { useState, useEffect, useRef, useCallback } from "react";
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
import { PostCardSkeleton } from "./components/SkeletonLoader";
import { Settings } from "./components/Settings";
import { UserProfile } from "./components/UserProfile";
import { Footer } from "./components/Footer";
import { usePosts, useCategories } from "./hooks/usePosts";
import { useComments } from "./hooks/useComments";
import { useAuth } from "./context/AuthContext";
import type { Post } from "./types";
import { motion, AnimatePresence } from "framer-motion";

// Main Application Component: Manages state, routing, and layout.
function App() {
  const [view, setView] = useState<
    "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings" | "profile"
  >(() => {
    const saved = localStorage.getItem("app_view");
    const validViews = ["home", "posts", "about", "contact", "login", "admin", "settings", "profile"];
    return validViews.includes(saved || "")
      ? (saved as "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings" | "profile")
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

  const handleAddComment = async (data: { user: string; text: string; parentId?: string | null }) => {
    if (!selectedPost) return;
    try {
      await addComment(data.text, data.parentId);
    } catch (err) {
      alert("Please login to comment!");
    }
  };

  const handleNavigate = (
    viewName: "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings" | "profile",
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
      case "profile":
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
    if (view === "profile") return "Profile - DevPulse";
    if (selectedCategory) return `${selectedCategory} Articles - DevPulse`;
    if (searchQuery) return `Search: ${searchQuery} - DevPulse`;
    return "DevPulse - The Modern Developer Blog";
  };

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, loadMore]);

  const InfiniteScrollLoader = () => {
    if (!hasMore) return null;
    return (
      <div
        ref={observerTarget}
        style={{ textAlign: "center", marginTop: "2rem", marginBottom: "2rem", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {loading && <Loader2 className="animate-spin" style={{ color: "var(--primary)" }} />}
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
      <Navbar 
        currentView={view} 
        onNavigate={handleNavigate} 
        searchQuery={searchQuery}
        onSearch={(q) => {
          setSearchQuery(q);
          if (q && view !== "posts" && view !== "home") {
            setView("home");
            setSelectedPost(null);
            setSelectedCategory(null);
          }
        }}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          if (view !== "posts" && view !== "home") {
            setView("home");
            setSelectedPost(null);
          }
        }}
      />
      <Hero />
      <main className="container main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={view + (selectedPost ? "-post-" + (selectedPost.id || selectedPost._id) : "") + (selectedCategory ? "-cat-" + selectedCategory : "")}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {view === "admin" ? (
              <AdminDashboard onNavigate={handleNavigate} />
            ) : view === "settings" ? (
          <Settings />
        ) : view === "profile" ? (
          <UserProfile />
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
                  {loading && posts.length === 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      <PostCardSkeleton />
                      <PostCardSkeleton />
                      <PostCardSkeleton />
                    </div>
                  )}
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
                  <InfiniteScrollLoader />
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
                  {loading && posts.length === 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      <PostCardSkeleton />
                      <PostCardSkeleton />
                      <PostCardSkeleton />
                    </div>
                  )}
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
                  <InfiniteScrollLoader />
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
        </motion.div>
      </AnimatePresence>
    </main>
    <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
