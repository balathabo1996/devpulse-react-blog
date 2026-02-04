/** Represents a blog post entity. */
export interface Post {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
}

/** Represents a user comment entity. */
export interface Comment {
  id: number;
  postId: number;
  user: string;
  text: string;
  date: string;
}
