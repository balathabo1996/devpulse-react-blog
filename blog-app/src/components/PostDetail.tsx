// Post Content: Renders the full content of a blog post
import { ArrowLeft, Calendar, Tag } from "lucide-react";

import type { Post, Comment } from "../types";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";

/** Props for the PostDetail component. */
interface PostDetailProps {
  post: Post;
  comments: Comment[];
  onAddComment: (data: { user: string; text: string }) => void;
  onBack: () => void;
}

/** Displays full post content with comments and like button. */
export function PostDetail({
  post,
  comments,
  onAddComment,
  onBack,
}: PostDetailProps) {
  return (
    <article className="detail-article">
      <button onClick={onBack} className="btn btn-ghost detail-back-btn">
        <ArrowLeft size={20} /> Back to Articles
      </button>
      <div className="detail-image-wrapper">
        <img src={post.imageUrl} alt={post.title} className="detail-image" />
        <div className="detail-meta">
          <span className="meta-item">
            <Calendar size={16} /> {post.date}
          </span>
          <span className="meta-item">
            <Tag size={16} /> {post.category}
          </span>
        </div>
        <h1 className="detail-title">{post.title}</h1>
        <div className="detail-body">{post.content}</div>
      </div>

      <section>
        <CommentList comments={comments} />
        <CommentForm onSubmit={onAddComment} />
      </section>
    </article>
  );
}

/** Simple Like Button component with state. */
