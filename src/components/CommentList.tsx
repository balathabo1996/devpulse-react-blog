import type { Comment } from "../types";
import { CommentItem } from "./CommentItem";

/** Props for the CommentList component. */
interface CommentListProps {
  comments: Comment[];
}

/** Renders a list of user comments. */
export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div
        style={{
          padding: "2rem 0",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}
      >
        No comments yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        Comments ({comments.length})
      </h3>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
