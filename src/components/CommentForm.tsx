import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';

interface CommentFormData {
  user: string;
  text: string;
}

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<CommentFormData>();

  const onFormSubmit = (data: CommentFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form 
      onSubmit={handleSubmit(onFormSubmit)} 
      style={{ 
        backgroundColor: 'var(--surface)', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius)', 
        boxShadow: 'var(--shadow-sm)',
        marginTop: '2rem',
        border: '1px solid var(--border)'
      }}
    >
      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add a Comment</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="user" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
          Name <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input 
          id="user"
          {...register('user', { 
            required: 'Name is required', 
            minLength: { value: 2, message: 'Name must be at least 2 characters' } 
          })}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius)', 
            border: `1px solid ${errors.user ? 'var(--danger)' : 'var(--border)'}`,
            fontFamily: 'inherit'
          }}
          placeholder="John Doe"
        />
        {errors.user && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.user.message}</p>}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="text" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
          Comment <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <textarea 
          id="text"
          rows={4}
          {...register('text', { 
            required: 'Comment is required', 
            minLength: { value: 10, message: 'Comment must be at least 10 characters' } 
          })}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius)', 
            border: `1px solid ${errors.text ? 'var(--danger)' : 'var(--border)'}`,
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
          placeholder="Share your thoughts..."
        />
        {errors.text && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.text.message}</p>}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <Send size={16} /> Post Comment
      </button>
    </form>
  );
}
