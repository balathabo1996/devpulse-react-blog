// Post Content: Renders the full content of a blog post
import { ArrowLeft, Calendar, Tag, ThumbsUp } from "lucide-react";
import { useState } from "react";
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
      <hr className="detail-divider" />
      <div className="like-section">
        <LikeButton />
      </div>
      <section>
        <CommentList comments={comments} />
        <CommentForm onSubmit={onAddComment} />
      </section>
    </article>
  );
}

/** Simple Like Button component with state. */
function LikeButton() {
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
    <button
      onClick={handleLike}
      className={`btn btn-with-icon ${hasLiked ? "btn-primary like-btn-active" : "btn-ghost like-btn-inactive"}`}
    >
      <ThumbsUp size={18} fill={hasLiked ? "currentColor" : "none"} />{" "}
      {likes > 0 ? `${likes} Likes` : "Like this post"}
    </button>
  );
}
