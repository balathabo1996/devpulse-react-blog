import { Calendar } from "lucide-react";
import type { Post } from "../types";

/** Props for the PostCard component. */
interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

/** Horizontal card component displaying post summary with hover effects. */
export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <article
      className="post-card animate-fade-in"
      onClick={() => onClick(post)}
      style={{
        position: "relative",
        height: "300px", // increased height for impact
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "2rem",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        cursor: "pointer",
        background: `linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.2)), url(${post.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--glow)";
        e.currentTarget.style.borderColor = "var(--secondary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none"; // or var(--shadow)
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div className="card-content" style={{ zIndex: 2, width: "100%" }}>
        <div className="card-header" style={{ marginBottom: "0.5rem" }}>
          <div>
            <div
              className="card-meta"
              style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}
            >
              <span
                className="card-category"
                style={{
                  background: "var(--primary)",
                  color: "black",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                {post.category}
              </span>
              <span
                style={{ margin: "0 0.5rem", color: "rgba(255,255,255,0.5)" }}
              >
                •
              </span>
              <div
                className="meta-item"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
            </div>
            <h3
              className="card-title"
              style={{
                fontSize: "1.75rem",
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {post.title}
            </h3>
          </div>
        </div>
        <p
          className="card-excerpt"
          style={{
            color: "rgba(255,255,255,0.8)",
            marginBottom: "1.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.excerpt}
        </p>
        <div className="card-actions">
          {/* Read button can be implicit or styled differently, keeping it as link-style for cleanliness */}
          <span
            style={{
              color: "var(--accent)",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Read Article <span style={{ fontSize: "1.2rem" }}>→</span>
          </span>
        </div>
      </div>
    </article>
  );
}
