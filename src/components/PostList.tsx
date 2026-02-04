import type { Post } from "../types";
import { PostCard } from "./PostCard";

interface PostListProps {
  posts: Post[];
  onSelect: (post: Post) => void;
}

export function PostList({ posts, onSelect }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "var(--text-muted)",
        }}
      >
        No posts found.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onClick={onSelect} />
      ))}
    </div>
  );
}
