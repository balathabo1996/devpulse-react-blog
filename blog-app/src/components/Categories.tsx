// Categories Page: functions to filter posts by category
import { Tag, ArrowRight } from "lucide-react";

interface CategoriesProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

const categoryImages: Record<string, string> = {
  Engineering: "/images/cat-engineering.jpg",
  AI: "/images/cat-ai.jpg",
  Career: "/images/cat-career.jpg",
  Tutorials: "/images/cat-tutorials.jpg",
};

/** Categories Page Component displaying available topics. */
export function Categories({ categories, onSelectCategory }: CategoriesProps) {
  return (
    <div className="layout-grid">
      <div className="widget widget-full-width">
        <h1 className="hero-title page-title">
          Explore <span className="text-gradient">Categories</span>
        </h1>
        <p
          className="detail-body page-description"
          style={{ marginBottom: "3rem" }}
        >
          Browse our collection of articles by topic. Find exactly what you are
          looking for.
        </p>

        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className="category-card"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4)), url(${
                  categoryImages[category] ||
                  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
                })`,
              }}
            >
              <div className="category-card-icon">
                <Tag size={20} />
              </div>

              <h3 className="category-card-title">{category}</h3>

              <div className="category-card-link">
                Browse Articles <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
