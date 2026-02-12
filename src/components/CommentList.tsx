// Comment List: Renders a list of CommentItems
import type { Comment } from "../types";
import { CommentItem } from "./CommentItem";

// Props for the CommentList component.
interface CommentListProps {
  comments: Comment[];
}

// Renders a list of user comments.
export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div
        className="widget-empty"
        style={{ padding: "2rem 0", fontStyle: "italic" }}
      >
        No comments yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="comments-section">
      <h3 className="comments-header">Comments ({comments.length})</h3>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
