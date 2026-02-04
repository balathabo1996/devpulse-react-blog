import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

interface CommentFormData {
  user: string;
  text: string;
}
interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
}

/** React Hook Form for submitting comments with validation. */
export function CommentForm({ onSubmit }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>();

  const onFormSubmit = (data: CommentFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="comment-form">
      <h3 className="widget-title">Add a Comment</h3>

      <div className="form-group">
        <label htmlFor="user" className="form-label">
          Name <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <input
          id="user"
          {...register("user", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          className="form-input"
          style={{
            borderColor: errors.user ? "var(--danger)" : "var(--border)",
          }}
          placeholder="John Doe"
        />
        {errors.user && <p className="form-error">{errors.user.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="text" className="form-label">
          Comment <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <textarea
          id="text"
          rows={4}
          {...register("text", {
            required: "Comment is required",
            minLength: {
              value: 10,
              message: "Comment must be at least 10 characters",
            },
          })}
          className="form-input"
          style={{
            borderColor: errors.text ? "var(--danger)" : "var(--border)",
            resize: "vertical",
          }}
          placeholder="Share your thoughts..."
        />
        {errors.text && <p className="form-error">{errors.text.message}</p>}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <Send size={16} /> Post Comment
      </button>
    </form>
  );
}
