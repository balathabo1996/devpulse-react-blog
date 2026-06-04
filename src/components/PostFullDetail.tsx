// Blog Post Page: Main view for a specific blog post including comments
import { ArrowLeft, Calendar, Tag, Eye, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { Post, Comment } from "../types";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useAuth } from "../context/AuthContext";
import DOMPurify from "dompurify";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import { io } from "socket.io-client";
import { Helmet } from "react-helmet-async";

interface PostFullDetailProps {
  post: Post;
  comments: Comment[];
  onAddComment: (data: { user: string; text: string; parentId?: string | null }) => void;
  onLike: (id: string | number) => Promise<void>;
  onView: (id: string | number) => Promise<void>;
  onBack: () => void;
}

// Full-page Post Detail with hero image and large typography.
export function PostFullDetail({
  post,
  comments,
  onAddComment,
  onLike,
  onView,
  onBack,
}: PostFullDetailProps) {
  const { user, signInWithGoogle } = useAuth();
  
  useEffect(() => {
    onView(post.id);
  }, [post.id, onView]);

  // Prism.js Syntax Highlighting
  useEffect(() => {
    // React Quill outputs <pre> tags for code blocks. Prism expects <pre><code>...</code></pre>.
    const codeBlocks = document.querySelectorAll('.full-detail-text pre');
    codeBlocks.forEach(block => {
      if (!block.querySelector('code')) {
        const code = document.createElement('code');
        code.className = 'language-typescript'; // Default to TS/JS
        code.innerHTML = block.innerHTML;
        block.innerHTML = '';
        block.appendChild(code);
      }
    });
    Prism.highlightAll();
  }, [post.content]);

  // Socket.io Live Active Readers
  const [activeReaders, setActiveReaders] = useState(1);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${post.id}/related`);
        if (response.ok) {
          const data = await response.json();
          setRelatedPosts(data);
        }
      } catch (err) {
        console.error("Failed to fetch related posts", err);
      }
    };
    fetchRelated();
  }, [post.id]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    
    socket.emit("join_post", post.id);

    socket.on("active_readers", (count: number) => {
      setActiveReaders(count);
    });

    return () => {
      socket.emit("leave_post", post.id);
      socket.disconnect();
    };
  }, [post.id]);

  const [isLiking, setIsLiking] = useState(false);
  const likesCount = post.likes?.length || 0;
  const hasLiked = user?.email && post.likes?.includes(user.email);

  const handleLike = async () => {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error("Login failed:", error);
      }
      return;
    }
    setIsLiking(true);
    try {
      await onLike(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="layout-grid">
      <Helmet>
        <title>{post.title} | DevPulse</title>
        <meta name="description" content={post.excerpt} />
        
        {/* Open Graph Tags for Facebook, Discord, LinkedIn */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.imageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.imageUrl} />
      </Helmet>

      <div className="widget full-detail-widget">
        {/* Full Width Hero Image */}
        <div className="full-detail-hero">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="full-detail-image"
          />
          <div className="full-detail-overlay" />
          <div className="full-detail-content">
            <button
              onClick={onBack}
              className="btn btn-primary full-detail-back-btn"
            >
              <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} /> Back to
              Posts
            </button>
            <h1 className="hero-title full-detail-title">{post.title}</h1>
            <div className="full-detail-meta">
              <span className="meta-item">
                <Calendar size={18} /> {post.date}
              </span>
              <span className="meta-item">
                <Tag size={18} /> {post.category}
              </span>
              <span className="meta-item">
                <Eye size={18} /> {post.views || 0} views
              </span>
            </div>
            {activeReaders > 0 && (
              <div className="premium-readers-badge" title={`${activeReaders} ${activeReaders === 1 ? "person is" : "people are"} reading this right now`}>
                <span className="pulse-dot"></span>
                <Users size={14} style={{ color: "#10b981", marginLeft: "-2px", marginRight: "-2px" }} />
                <span><strong>{activeReaders}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="full-detail-body-container">
          <div className="detail-body full-detail-text">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "2rem", marginTop: "3rem", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}>
            <div className="full-detail-like-container" style={{ margin: 0, padding: 0, border: "none" }}>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`like-btn-styled ${hasLiked ? "like-btn-liked" : ""}`}
              >
                <span className="like-btn-heart">
                  {hasLiked ? "❤️" : "🤍"}
                </span>
                <span className="like-btn-label">
                  {isLiking
                    ? "..."
                    : hasLiked
                    ? `${likesCount} Liked!`
                    : likesCount > 0
                    ? `${likesCount} Likes`
                    : "Like this post"}
                </span>
              </button>
            </div>

            <div className="social-share-container">
              <span className="share-label">Share article:</span>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="social-btn twitter" aria-label="Share on X (Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.873 11.633Z"/></svg>
              </a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="social-btn linkedin" aria-label="Share on LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="social-btn facebook" aria-label="Share on Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
              </a>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="related-articles-section" style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
                You Might Also Like
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                {relatedPosts.map(related => (
                  <div key={related.id} className="post-card" style={{ cursor: "pointer", display: "flex", flexDirection: "column" }} onClick={() => window.location.href = `/?post=${related.id}`}>
                    {related.imageUrl && (
                      <div className="post-image-container" style={{ height: "150px" }}>
                        <img src={related.imageUrl} alt={related.title} className="post-image" />
                      </div>
                    )}
                    <div className="post-content" style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div className="post-category" style={{ alignSelf: "flex-start", marginBottom: "0.5rem" }}>{related.category}</div>
                      <h4 style={{ fontSize: "1.1rem", margin: "0 0 0.5rem 0", color: "var(--text-primary)", fontWeight: 600 }}>{related.title}</h4>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
                        {related.excerpt && related.excerpt.length > 80 ? `${related.excerpt.substring(0, 80)}...` : related.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="comments-section-wrapper" style={{ marginTop: "4rem" }}>
            <CommentList 
              comments={comments} 
              onReply={(parentId, text) => onAddComment({ user: user?.displayName || "", text, parentId })} 
            />
            <CommentForm onSubmit={onAddComment} />
          </div>
        </div>
      </div>
    </article>
  );
}
