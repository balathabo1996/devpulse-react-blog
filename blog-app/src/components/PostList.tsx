// Post Grid: Displays a grid/list of PostCards
import type { Post } from "../types";
import { PostCard } from "./PostCard";

/** Props for the PostList component. */
interface PostListProps {
  posts: Post[];
  onSelect: (post: Post) => void;
}

/** Renders a list of PostCard components or a message if empty. */
export function PostList({ posts, onSelect }: PostListProps) {
  if (posts.length === 0) {
    return <div className="post-list-empty">No posts found.</div>;
  }
  return (
    <div className="post-list-wrapper">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onClick={onSelect} />
      ))}
    </div>
  );
}
