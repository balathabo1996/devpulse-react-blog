// Comment List: Renders a list of CommentItems
import { MessageCircle, MessageSquareDashed } from "lucide-react";
import type { Comment } from "../types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="comments-empty-state">
        <div className="comments-empty-icon">
          <MessageSquareDashed size={48} color="var(--text-muted)" strokeWidth={1.5} />
        </div>
        <p className="comments-empty-title">No comments yet</p>
        <p className="comments-empty-sub">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <div className="comments-header">
        <MessageCircle size={20} />
        <h3>Comments <span className="comments-count">({comments.length})</span></h3>
      </div>
      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
