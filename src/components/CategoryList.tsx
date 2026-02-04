interface CategoryListProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryList({ categories, selectedCategory, onSelectCategory }: CategoryListProps) {
  return (
    <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
        Categories
      </h3>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <li>
          <button 
            onClick={() => onSelectCategory(null)}
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              padding: '0.5rem', 
              borderRadius: 'var(--radius)',
              backgroundColor: selectedCategory === null ? 'var(--primary)' : 'transparent',
              color: selectedCategory === null ? 'white' : 'var(--text)',
              transition: 'all 0.2s',
              fontWeight: selectedCategory === null ? 600 : 400
            }}
          >
            All Categories
          </button>
        </li>
        {categories.map(category => (
          <li key={category}>
            <button 
              onClick={() => onSelectCategory(category)}
              style={{ 
                width: '100%', 
                textAlign: 'left', 
                padding: '0.5rem', 
                borderRadius: 'var(--radius)',
                backgroundColor: selectedCategory === category ? 'var(--primary)' : 'transparent',
                color: selectedCategory === category ? 'white' : 'var(--text)',
                transition: 'all 0.2s',
                fontWeight: selectedCategory === category ? 600 : 400
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
