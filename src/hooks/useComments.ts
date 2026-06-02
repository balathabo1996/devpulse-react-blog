import { useState, useEffect } from "react";
import axios from "axios";
import type { Comment } from "../types";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export function useComments(postId: number | string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { socket } = useSocket();
  const { token } = useAuth();

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/comments/${postId}`,
        );
        setComments(res.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();

    if (socket) {
      const handleNewComment = (comment: Comment) => {
        setComments((prev) => [...prev, comment]);
      };

      socket.on(`new_comment_${postId}`, handleNewComment);

      return () => {
        socket.off(`new_comment_${postId}`, handleNewComment);
      };
    }
  }, [postId, socket]);

  const addComment = async (text: string) => {
    if (!postId || !token) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/comments`,
        { postId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  };

  return { comments, addComment };
}
