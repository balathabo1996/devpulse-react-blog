import React, { createContext, useContext, useState, useEffect } from "react";
import type { Comment } from "@/types";

interface CommentContextType {
  comments: Record<number, Comment[]>;
  addComment: (postId: number, user: string, text: string) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useState<Record<number, Comment[]>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("blog_comments");
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse comments", e);
      }
    }
  }, []);

  // Save to localStorage whenever comments change
  useEffect(() => {
    if (Object.keys(comments).length > 0) {
      localStorage.setItem("blog_comments", JSON.stringify(comments));
    }
  }, [comments]);

  const addComment = (postId: number, user: string, text: string) => {
    const newComment: Comment = {
      id: Date.now(),
      postId,
      user,
      text,
      date: new Date().toLocaleDateString(),
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
  };

  return (
    <CommentContext.Provider value={{ comments, addComment }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
}
