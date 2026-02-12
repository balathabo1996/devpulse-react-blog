// Comment Item: Displays a single comment with user info and date
import type { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  // Generate initials from user name
  const initials = comment.user
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="comment-card animate-fade-in">
      <div className="comment-avatar">{initials}</div>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.user}</span>
          <span className="comment-date">{comment.date}</span>
        </div>
        <p className="comment-text">{comment.text}</p>
      </div>
    </div>
  );
}
