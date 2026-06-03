import { Loader2, ArrowRight } from "lucide-react";
import { usePosts } from "../hooks/usePosts";
import { PostList } from "./PostList";
import { PostCardSkeleton } from "./SkeletonLoader";
import type { Post } from "../types";

interface CategorySectionProps {
  category: string;
  onSelectPost: (post: Post) => void;
  onViewCategory: (category: string) => void;
}

export function CategorySection({ category, onSelectPost, onViewCategory }: CategorySectionProps) {
  const { posts, loading } = usePosts(category, "");

  if (loading && posts.length === 0) {
    return (
      <div className="section-header" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Latest in <span className="text-gradient">{category}</span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="section-header" style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Latest in <span className="text-gradient">{category}</span>
        </h2>
        <button 
          onClick={() => onViewCategory(category)}
          className="btn btn-ghost" 
          style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          View All <ArrowRight size={16} />
        </button>
      </div>
      <PostList posts={posts.slice(0, 3)} onSelect={onSelectPost} />
    </div>
  );
}
