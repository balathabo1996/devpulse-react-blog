// Post Card: Preview card for a blog post in a list
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
      className="post-card post-card-inner animate-fade-in"
      onClick={() => onClick(post)}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.2)), url(${post.imageUrl})`,
      }}
    >
      <div className="card-content" style={{ zIndex: 2, width: "100%" }}>
        <div className="card-header card-header-mb">
          <div>
            <div className="card-meta card-meta-mb">
              <span className="card-category">{post.category}</span>
              <span className="meta-separator">•</span>
              <div className="meta-item meta-date">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
            </div>
            <h3 className="card-title card-title-large">{post.title}</h3>
          </div>
        </div>
        <p className="card-excerpt card-excerpt-style">{post.excerpt}</p>
        <div className="card-actions">
          {/* Read button can be implicit or styled differently, keeping it as link-style for cleanliness */}
          <span className="read-article-link">
            Read Article <span className="read-article-arrow">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}
