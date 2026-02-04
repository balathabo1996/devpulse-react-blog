/** Props for the CategoryList component. */
interface CategoryListProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

/** Sidebar widget to filter posts by category. */
export function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <div className="widget">
      <h3 className="widget-title">Categories</h3>
      <ul className="category-list">
        <li>
          <button
            onClick={() => onSelectCategory(null)}
            className="category-btn"
            style={{
              backgroundColor:
                selectedCategory === null ? "var(--primary)" : "transparent",
              color: selectedCategory === null ? "white" : "var(--text)",
              fontWeight: selectedCategory === null ? 600 : 400,
            }}
          >
            All Categories
          </button>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onSelectCategory(category)}
              className="category-btn"
              style={{
                backgroundColor:
                  selectedCategory === category
                    ? "var(--primary)"
                    : "transparent",
                color: selectedCategory === category ? "white" : "var(--text)",
                fontWeight: selectedCategory === category ? 600 : 400,
              }}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
