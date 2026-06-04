import { motion } from "framer-motion";
import { ChevronRight, Grid } from "lucide-react";
// Props for the CategoryList component.
interface CategoryListProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

// Sidebar widget to filter posts by category.
export function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <motion.div className="widget premium-widget" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.5rem', background: 'rgba(168, 85, 247, 0.2)', color: 'var(--secondary)', borderRadius: '0.5rem', display: 'flex' }}>
          <Grid size={20} />
        </div>
        <h3 className="widget-title" style={{ margin: 0, border: 'none', padding: 0 }}>Topics</h3>
      </div>
      <ul className="premium-category-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {['All Categories', ...categories].map((category) => {
          const isAll = category === 'All Categories';
          const catValue = isAll ? null : category;
          const isActive = selectedCategory === catValue;
          
          return (
            <li key={category}>
              <button
                onClick={() => onSelectCategory(catValue)}
                className={`premium-category-btn ${isActive ? "active" : ""}`}
              >
                <span className="cat-name">{category}</span>
                <ChevronRight size={16} className="cat-icon" />
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
