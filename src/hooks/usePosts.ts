import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";

export function usePosts(category: string | null, search: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { socket } = useSocket();
  const { token } = useAuth();

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [category, search]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "10");
        if (category) params.append("category", category);
        if (search) params.append("search", search);

        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/posts?${params.toString()}`);
        
        const fetchedPosts = res.data.posts;
        if (page === 1) {
          setPosts(fetchedPosts);
        } else {
          setPosts(prev => {
            // Prevent duplicate entries due to strict mode double firing
            const newPosts = fetchedPosts.filter((p: Post) => !prev.some(existing => existing.id === p.id));
            return [...prev, ...newPosts];
          });
        }
        
        setHasMore(page < res.data.totalPages);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [page, category, search]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(p => p + 1);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handlePostUpdated = (updatedPost: { id: string, likes: string[], views: number }) => {
      setPosts(prev => prev.map(p => {
        if (p.id === updatedPost.id) {
          return { ...p, likes: updatedPost.likes, views: updatedPost.views };
        }
        return p;
      }));
    };

    socket.on("post_updated", handlePostUpdated);
    return () => {
      socket.off("post_updated", handlePostUpdated);
    };
  }, [socket]);

  const likePost = useCallback(async (postId: string | number) => {
    if (!token) throw new Error("Must be logged in to like");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to like post", error);
      throw error;
    }
  }, [token]);

  const viewPost = useCallback(async (postId: string | number) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/posts/${postId}/view`);
    } catch (error) {
      console.error("Failed to view post", error);
    }
  }, []);

  return { posts, loading, hasMore, loadMore, likePost, viewPost };
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return categories;
}
