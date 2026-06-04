import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import type { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string, text: string) => void;
  parentIdForReply?: string; 
}

export function CommentItem({ comment, onReply, parentIdForReply }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const initial = comment.user ? comment.user.charAt(0).toUpperCase() : '?';

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(parentIdForReply || comment.id, replyText);
    setIsReplying(false);
    setReplyText("");
  };

  return (
    <div className="comment-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
        <div className="comment-avatar-container">
          {comment.userAvatar ? (
            <img src={comment.userAvatar} alt={`${comment.user}'s avatar`} className="comment-avatar-img" />
          ) : (
            <div className="comment-avatar-fallback">
              {initial}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div className="comment-meta">
            <span className="comment-author">{comment.user}</span>
            <span className="comment-date">{comment.date}</span>
          </div>
          <p className="comment-text">{comment.text}</p>
          
          <button 
            onClick={() => setIsReplying(!isReplying)}
            style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem", marginTop: "0.5rem", padding: 0 }}
          >
            <MessageCircle size={14} /> Reply
          </button>
        </div>
      </div>

      {isReplying && (
        <div style={{ width: "100%", marginTop: "1rem", paddingLeft: "3.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="text" 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.user}...`}
              style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              autoFocus
            />
            <button 
              onClick={handleReplySubmit}
              className="btn btn-primary"
              style={{ padding: "0 1rem" }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
