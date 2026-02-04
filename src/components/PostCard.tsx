import { Calendar } from "lucide-react";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <article
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "row",
        marginBottom: "1.5rem",
        border: "1px solid var(--border)",
        cursor: "default",
        position: "relative",
      }}
      className="post-card animate-fade-in"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
        e.currentTarget.style.boxShadow = "var(--glow)";
        e.currentTarget.style.borderColor = "var(--secondary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "var(--shadow)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div style={{ width: "240px", flexShrink: 0 }}>
        <img
          src={post.imageUrl}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div
        style={{
          padding: "1.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                lineHeight: 1.3,
              }}
            >
              {post.title}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--text-muted)",
                fontSize: "0.875rem",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              <span>•</span>
              <span
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  color: "#60a5fa",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {post.category}
              </span>
            </div>
          </div>
        </div>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1rem",
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {post.excerpt}
        </p>

        <div style={{ textAlign: "right" }}>
          <button
            onClick={() => onClick(post)}
            className="btn btn-primary"
            style={{ padding: "0.5rem 1.5rem", borderRadius: "9999px" }}
          >
            Read
          </button>
        </div>
      </div>
    </article>
  );
}
