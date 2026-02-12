// Category List: Renders a list of clickable category pills/links
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
            className={`category-btn ${
              selectedCategory === null ? "active" : "inactive"
            }`}
          >
            All Categories
          </button>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onSelectCategory(category)}
              className={`category-btn ${
                selectedCategory === category ? "active" : "inactive"
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
