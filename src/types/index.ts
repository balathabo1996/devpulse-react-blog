// Type Definitions: Shared TypeScript interfaces for Blog Posts, Categories, and Comments
/**
 * Represents a Blog Post.
 */
export interface Post {
  id: string | number;
  _id?: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  status?: "draft" | "published";
  likes?: string[];
  views?: number;
}

/**
 * Represents a User Comment.
 */
export interface Comment {
  id: string;
  postId: string;
  parentId?: string | null;
  user: string;
  userEmail: string;
  userAvatar?: string;
  text: string;
  date: string;
}
