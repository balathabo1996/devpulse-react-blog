import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Categories } from "@/components/Categories";

// Categories Page: Displays and handles category selection.
export default function CategoriesPage() {
  // State for storing list of categories
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch posts to derive categories dynamically
    async function fetchCategories() {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();
      const CATEGORIES = ["Engineering", "AI", "Career", "Tutorials"];
      // Sinthesize categories from post data
      const derived = new Set<string>(
        data.map((p: { id: number }) => CATEGORIES[p.id % CATEGORIES.length]),
      );
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
