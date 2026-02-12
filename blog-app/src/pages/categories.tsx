import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Categories } from "@/components/Categories";
import type { Post } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // We need to fetch posts to know categories, or just hardcode/fetch categories list.
    // Fetching posts is safer to match Home.
    async function fetchCategories() {
       const res = await fetch("https://jsonplaceholder.typicode.com/posts");
       const data = await res.json();
       const CATEGORIES = ["Engineering", "AI", "Career", "Tutorials"];
       // In a real app we'd get unique categories from data, 
       // but here we are synthesizing them.
       // Let's just use our static list for simplicity + data derived ones.
       
       // actually, let's map data to get same consistent random categories
       const derived = new Set<string>(data.map((p: any) => CATEGORIES[p.id % CATEGORIES.length]));
       setCategories(Array.from(derived));
    }
    fetchCategories();
  }, []);

  const handleSelectCategory = (cat: string) => {
    router.push({ pathname: "/posts", query: { category: cat } });
  };

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
       <Categories 
          categories={categories} 
          onSelectCategory={handleSelectCategory}
       />
    </div>
  );
}
