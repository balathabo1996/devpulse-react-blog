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
      // Retain JS hover for now as requested, or can move to CSS completely.
      // Keeping it simple as per 'not mess up' request, moving base styles to CSS.
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
      <div className="card-image-wrapper">
        <img src={post.imageUrl} alt={post.title} className="card-image" />
      </div>
      <div className="card-content">
        <div className="card-header">
          <div>
            <h3 className="card-title">{post.title}</h3>
            <div className="card-meta">
              <div className="meta-item">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              <span>•</span>
              <span className="card-category">{post.category}</span>
            </div>
          </div>
        </div>
        <p className="card-excerpt">{post.excerpt}</p>
        <div className="card-actions">
          <button
            onClick={() => onClick(post)}
            className="btn btn-primary btn-rounded"
          >
            Read
          </button>
        </div>
      </div>
    </article>
  );
}
