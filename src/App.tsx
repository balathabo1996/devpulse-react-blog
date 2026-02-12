// App Component: Main application component handling routing and layout structure
import { useState, useMemo, useEffect } from "react";
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

// Main Application Component: Manages state, routing, and layout.
function App() {
  // State for current view (routing)
  const [view, setView] = useState<
    "home" | "posts" | "categories" | "about" | "contact"
  >(() => {
    // Initialize view from local storage or default to 'home'
    const saved = localStorage.getItem("app_view");
    const validViews = ["home", "posts", "categories", "about", "contact"];
    return validViews.includes(saved || "")
      ? (saved as "home" | "posts" | "categories" | "about" | "contact")
      : "home";
  });

  // State for posts data
  const [posts] = useState<Post[]>(initialPosts);

  // State for currently selected post
  const [selectedPost, setSelectedPost] = useState<Post | null>(() => {
    // Initialize selected post from local storage
    const savedId = localStorage.getItem("app_post_id");
    return savedId
      ? initialPosts.find((p) => p.id === Number(savedId)) || null
      : null;
  });

  // State for comments, mapped by post ID
  const [comments, setComments] = useState<Record<number, Comment[]>>({});

  // State for currently selected category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => {
      // Initialize selected category from local storage
      return localStorage.getItem("app_category");
    },
  );

  // State for the last user who commented
  const [lastCommenter, setLastCommenter] = useState<string | null>(null);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized list of unique categories from posts
  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category))),
    [posts],
  );

  // Persistence Effects
  // Save current view to local storage
  useEffect(() => {
    localStorage.setItem("app_view", view);
  }, [view]);

  // Save selected post ID to local storage
  useEffect(() => {
    if (selectedPost) {
      localStorage.setItem("app_post_id", String(selectedPost.id));
    } else {
      localStorage.removeItem("app_post_id");
    }
  }, [selectedPost]);

  // Save selected category to local storage
  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem("app_category", selectedCategory);
    } else {
      localStorage.removeItem("app_category");
    }
  }, [selectedCategory]);

  // Filter posts based on category and search query
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

  // Handle adding a new comment
  const handleAddComment = (data: { user: string; text: string }) => {
    if (!selectedPost) return;
    const newComment: Comment = {
      id: Date.now(),
      postId: selectedPost.id,
      user: data.user,
      text: data.text,
      date: new Date().toLocaleDateString(),
    };
    // Update comments state
    setComments((prev) => ({
      ...prev,
      [selectedPost.id]: [...(prev[selectedPost.id] || []), newComment],
    }));
    setLastCommenter(data.user);
  };

  // Handle navigation between views
  const handleNavigate = (
    viewName: "home" | "posts" | "categories" | "about" | "contact",
    reset?: boolean,
  ) => {
    setView(viewName);
    if (reset) {
      // Reset filters if requested
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
      {/* Navbar Component */}
      <Navbar onNavigate={handleNavigate} />

      {/* Hero Section with Search */}
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

      {/* Main Content Area */}
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
              <div className="widget widget-full-width">
                <h1 className="hero-title hero-title-large">
                  {selectedCategory ? (
                    <div className="category-header">
                      <button
                        onClick={() => handleNavigate("categories")}
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
              <div className="section-header">
                <h2 className="section-title">
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

      {/* Footer Section */}
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
