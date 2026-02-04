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
      <div className="widget" style={{ gridColumn: "1 / -1" }}>
        <h1
          className="hero-title"
          style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}
        >
          Explore <span className="text-gradient">Categories</span>
        </h1>
        <p className="detail-body" style={{ marginBottom: "3rem" }}>
          Browse our collection of articles by topic. Find exactly what you are
          looking for.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className="post-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end", // Align content to bottom
                alignItems: "flex-start",
                padding: "2rem",
                textAlign: "left",
                cursor: "pointer",
                width: "100%",
                height: "250px", // Fixed height for visual consistency
                background: `linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.4)), url(${categoryImages[category] || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  color: "var(--primary)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Tag size={20} />
              </div>

              <h3
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {category}
              </h3>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--accent)",
                  fontWeight: "bold",
                  marginTop: "auto", // Push to bottom if needed, but flex-end handles it
                }}
              >
                Browse Articles <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
