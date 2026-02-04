import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { Post, Comment } from '../types';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';

interface PostDetailProps {
  post: Post;
  comments: Comment[];
  onAddComment: (data: { user: string; text: string }) => void;
  onBack: () => void;
}

export function PostDetail({ post, comments, onAddComment, onBack }: PostDetailProps) {
  return (
    <article style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: '2rem' }}>
      <button 
        onClick={onBack}
        className="btn btn-ghost"
        style={{ marginBottom: '1.5rem', paddingLeft: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ArrowLeft size={20} /> Back to Articles
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }} 
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={16} /> {post.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Tag size={16} /> {post.category}
          </span>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: 1.2 }}>{post.title}</h1>
        
        <div style={{ lineHeight: 1.8, fontSize: '1.125rem', color: 'var(--text)' }}>
          {post.content}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />

      <div style={{ marginBottom: '2rem' }}>
        <LikeButton />
      </div>

      <section>
        <CommentList comments={comments} />
        <CommentForm onSubmit={onAddComment} />
      </section>
    </article>
  );
}

import { ThumbsUp } from 'lucide-react';
import { useState } from 'react';

function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <button 
      onClick={handleLike}
      className={`btn ${hasLiked ? 'btn-primary' : 'btn-ghost'}`}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: hasLiked ? 'none' : '1px solid var(--border)' }}
    >
      <ThumbsUp size={18} fill={hasLiked ? 'currentColor' : 'none'} />
      {likes > 0 ? `${likes} Likes` : 'Like this post'}
    </button>
  );
}
