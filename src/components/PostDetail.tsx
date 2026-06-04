// Post Content: Renders the full content of a blog post
import { ArrowLeft, Calendar, Tag, ThumbsUp, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import type { Post, Comment } from "../types";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useAuth } from "../context/AuthContext";

// Props for the PostDetail component.
interface PostDetailProps {
  post: Post;
  comments: Comment[];
  onAddComment: (data: { user: string; text: string }) => void;
  onLike: (id: string | number) => Promise<void>;
  onView: (id: string | number) => Promise<void>;
  onBack: () => void;
}

// Displays full post content with comments and like button.
export function PostDetail({
  post,
  comments,
  onAddComment,
  onLike,
  onView,
  onBack,
}: PostDetailProps) {
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    onView(post.id);
  }, [post.id, onView]);

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
          <span className="meta-item" style={{ marginLeft: "10px" }}>
            <Eye size={16} /> {post.views || 0} views
          </span>
        </div>
        <h1 className="detail-title">{post.title}</h1>
        <div className="detail-body">{post.content}</div>
      </div>
      <hr className="detail-divider" />
      <div className="like-section">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`btn btn-with-icon ${hasLiked ? "btn-primary like-btn-active" : "btn-ghost like-btn-inactive"}`}
        >
          <ThumbsUp size={18} fill={hasLiked ? "currentColor" : "none"} />{" "}
          {likesCount > 0 ? `${likesCount} Likes` : "Like this post"}
        </button>
      </div>
      <section>
        <CommentList comments={comments} onReply={() => {}} />
        <CommentForm onSubmit={onAddComment} />
      </section>
    </article>
  );
}
