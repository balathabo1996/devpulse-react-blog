// Comment Item: Displays a single comment with user info and date
import { User } from "lucide-react";
import type { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="comment-item">
      <div className="comment-avatar-container">
        <User size={20} color="var(--text-muted)" />
      </div>
      <div>
        <div className="comment-meta">
          <span className="comment-author">{comment.user}</span>
          <span className="comment-date">{comment.date}</span>
        </div>
        <p className="comment-text">{comment.text}</p>
      </div>
    </div>
  );
}
