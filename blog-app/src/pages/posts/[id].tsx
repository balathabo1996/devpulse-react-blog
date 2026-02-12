import { useState, useEffect } from "react"; // Rebuild check
import { useRouter } from "next/router";
import { PostFullDetail } from "@/components/PostFullDetail";
import { posts as staticPosts } from "@/data/posts";
import type { Post } from "@/types";
import { useComments } from "@/context/CommentContext";

import Head from "next/head";

export default function PostPage() {
  const router = useRouter();

  // Retrieve post ID from URL query parameters
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { comments: allComments, addComment } = useComments();
  const comments = post ? allComments[post.id] || [] : [];

  useEffect(() => {
    if (!id) return;
    async function fetchPost() {
      try {
        // Check static first (simulating API fetch priority for existing data)
        const numId = Number(id);
        const staticPost = staticPosts.find((sp) => sp.id === numId);

        if (staticPost) {
          setPost(staticPost);
          setLoading(false);
          return;
        }

        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${id}`,
        );
        // If 404 from API, handle it
        if (!res.ok) throw new Error("Post not found");

        const p = await res.json();
        const CATEGORIES = ["Engineering", "AI", "Career", "Tutorials"];
        const mappedPost: Post = {
          id: p.id,
          title: p.title,
          date: new Date().toLocaleDateString(),
          excerpt: p.body.substring(0, 100) + "...",
          content: p.body,
          category: CATEGORIES[p.id % CATEGORIES.length],
          imageUrl: `/images/post${(p.id % 4) + 1}.jpg`,
        };
        setPost(mappedPost);
      } catch (err) {
        console.error("Failed to fetch post", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const handleAddComment = (data: { user: string; text: string }) => {
    if (!post) return;
    addComment(post.id, data.user, data.text);
  };

  if (loading)
    return (
      <div
        className="container"
        style={{ padding: "4rem", textAlign: "center" }}
      >
        Loading...
      </div>
    );
  if (!post)
    return (
      <div
        className="container"
        style={{ padding: "4rem", textAlign: "center" }}
      >
        Post not found
      </div>
    );

  return (
    <>
      <Head>
        <title>{post.title} | DevPulse</title>
        <meta name="description" content={post.excerpt} />
      </Head>
      <PostFullDetail
        post={post}
        comments={comments}
        onAddComment={handleAddComment}
        onBack={() => {
          // If we have history, back is nice, otherwise fallback to /posts
          if (window.history.length > 2) {
            router.back();
          } else {
            router.push("/posts");
          }
        }}
      />
    </>
  );
}
