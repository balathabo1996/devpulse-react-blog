// Comment List: Renders a list of CommentItems
import { MessageCircle, MessageSquareDashed } from "lucide-react";
import type { Comment } from "../types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onReply: (parentId: string, text: string) => void;
}

export function CommentList({ comments, onReply }: CommentListProps) {
  const parentComments = comments.filter(c => !c.parentId);
  
  const getChildren = (parentId: string) => {
    return comments.filter(c => c.parentId === parentId);
  };

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
        {parentComments.map((comment) => (
          <div key={comment.id} className="comment-thread" style={{ marginBottom: "1.5rem" }}>
            <CommentItem comment={comment} onReply={onReply} />
            
            {getChildren(comment.id).length > 0 && (
              <div className="comment-replies" style={{ marginLeft: "3rem", borderLeft: "2px solid rgba(255,255,255,0.05)", paddingLeft: "1rem", marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {getChildren(comment.id).map(child => (
                  <CommentItem key={child.id} comment={child} onReply={onReply} parentIdForReply={comment.id} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
