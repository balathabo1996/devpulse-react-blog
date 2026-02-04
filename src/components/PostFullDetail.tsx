import { ArrowLeft, Calendar, Tag, ThumbsUp } from "lucide-react";
import { useState } from "react";
import type { Post, Comment } from "../types";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";

interface PostFullDetailProps {
  post: Post;
  comments: Comment[];
  onAddComment: (data: { user: string; text: string }) => void;
  onBack: () => void;
}

/** Full-page Post Detail with hero image and large typography. */
export function PostFullDetail({
  post,
  comments,
  onAddComment,
  onBack,
}: PostFullDetailProps) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((p) => p - 1);
      setHasLiked(false);
    } else {
      setLikes((p) => p + 1);
      setHasLiked(true);
    }
  };

  return (
    <article className="layout-grid">
      <div
        className="widget"
        style={{
          gridColumn: "1 / -1",
          padding: 0,
          overflow: "hidden",
          border: "none",
          background: "transparent",
        }}
      >
        {/* Full Width Hero Image */}
        <div
          style={{
            position: "relative",
            height: "400px",
            marginBottom: "2rem",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              padding: "2rem",
            }}
          >
            <button
              onClick={onBack}
              className="btn btn-primary"
              style={{
                marginBottom: "1rem",
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
              }}
            >
              <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} /> Back to
              Posts
            </button>
            <h1
              className="hero-title"
              style={{
                fontSize: "3rem",
                color: "white",
                marginBottom: "0.5rem",
              }}
            >
              {post.title}
            </h1>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                color: "var(--text-muted)",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Calendar size={18} /> {post.date}
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Tag size={18} /> {post.category}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
          <div
            className="detail-body"
            style={{
              fontSize: "1.25rem",
              lineHeight: "1.8",
              marginBottom: "3rem",
            }}
          >
            {post.content}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <h3
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
            >
              Key Takeaways
            </h3>
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <li>Understanding the core concepts is crucial for mastery.</li>
              <li>Practical application reinforces theoretical knowledge.</li>
              <li>Continuous learning is key in this fast-paced industry.</li>
            </ul>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "4rem",
            }}
          >
            <button
              onClick={handleLike}
              className={`btn ${hasLiked ? "btn-primary" : "btn-ghost"}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: hasLiked ? "none" : "1px solid var(--border)",
                padding: "0.75rem 2rem",
                fontSize: "1.1rem",
              }}
            >
              <ThumbsUp size={20} fill={hasLiked ? "currentColor" : "none"} />{" "}
              {likes > 0 ? `${likes} Likes` : "Like this post"}
            </button>
          </div>

          <div className="widget">
            <CommentList comments={comments} />
            <CommentForm onSubmit={onAddComment} />
          </div>
        </div>
      </div>
    </article>
  );
}
