// Comment Form: Input form for users to add new comments
import { useForm } from "react-hook-form";
import { Send, LogIn, PenLine } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface CommentFormData {
  text: string;
}
interface CommentFormProps {
  onSubmit: (data: { user: string; text: string }) => void;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const { user, signInWithGoogle } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({ mode: "onChange" });

  const onFormSubmit = (data: CommentFormData) => {
    onSubmit({ user: "", text: data.text });
    reset();
  };

  if (!user) {
    return (
      <div className="comment-login-prompt">
        <div className="comment-login-icon">
          <PenLine size={48} color="var(--primary)" strokeWidth={1.5} />
        </div>
        <p className="comment-login-title">Join the conversation</p>
        <p className="comment-login-sub">Sign in to leave a comment and interact with the community.</p>
        <button onClick={signInWithGoogle} className="comment-login-btn">
          <LogIn size={16} />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="comment-form-styled">
      <div className="comment-form-header">
        <div className="comment-form-avatar">
          {user.photoURL
            ? <img src={user.photoURL} alt={user.displayName || ""} />
            : <span>{(user.displayName || user.email || "?").charAt(0).toUpperCase()}</span>
          }
        </div>
        <div className="comment-form-user">
          <span className="comment-form-username">{user.displayName || user.email}</span>
          <span className="comment-form-hint">Commenting as yourself</span>
        </div>
      </div>

      <div className="comment-form-body">
        <textarea
          id="text"
          rows={4}
          {...register("text", {
            required: "Comment is required",
            minLength: { value: 10, message: "Must be at least 10 characters" },
          })}
          className={`comment-textarea ${errors.text ? "error" : ""}`}
          placeholder="Share your thoughts on this article..."
        />
        {errors.text && <p className="form-error">{errors.text.message}</p>}
      </div>

      <div className="comment-form-footer">
        <button type="submit" className="comment-submit-btn">
          <Send size={15} />
          Post Comment
        </button>
      </div>
    </form>
  );
}
