// Type Definitions: Shared TypeScript interfaces for Blog Posts, Categories, and Comments
/**
 * Represents a Blog Post.
 */
export interface Post {
  id: string | number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  likes?: string[];
  views?: number;
}

/**
 * Represents a User Comment.
 */
export interface Comment {
  id: string | number;
  postId: string | number;
  user: string;
  userEmail: string;
  userAvatar?: string;
  date: string;
  text: string;
}
