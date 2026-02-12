// Blog Post Page: Main view for a specific blog post including comments
import { ArrowLeft, Calendar, Tag } from "lucide-react";

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
  return (
    <article className="layout-grid">
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
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="full-detail-body-container">
          <div className="detail-body full-detail-text">
            {post.content}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <h3 className="section-title" style={{ marginTop: "2rem" }}>
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

          <div className="widget">
            <CommentList comments={comments} />
            <CommentForm onSubmit={onAddComment} />
          </div>
        </div>
      </div>
    </article>
  );
}
