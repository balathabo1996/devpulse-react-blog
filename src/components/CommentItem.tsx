// Comment Item: Displays a single comment with user info and date
import { User } from "lucide-react";
import type { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  // Get initial for fallback avatar
  const initial = comment.user ? comment.user.charAt(0).toUpperCase() : '?';

  // Render individual comment with avatar and metadata
  return (
    <div className="comment-item">
      <div className="comment-avatar-container">
        {comment.userAvatar ? (
          <img src={comment.userAvatar} alt={`${comment.user}'s avatar`} className="comment-avatar-img" />
        ) : (
          <div className="comment-avatar-fallback">
            {initial}
          </div>
        )}
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
