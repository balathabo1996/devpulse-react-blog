import { User } from "lucide-react";
import type { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          backgroundColor: "var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <User size={20} color="var(--text-muted)" />
      </div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{comment.user}</span>
          <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {comment.date}
          </span>
        </div>
        <p style={{ lineHeight: 1.5 }}>{comment.text}</p>
      </div>
    </div>
  );
}
