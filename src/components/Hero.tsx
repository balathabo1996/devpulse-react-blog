import { Search } from "lucide-react";

interface HeroProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

/** Hero section with gradient text and glow background. */
export function Hero({ searchQuery, onSearch }: HeroProps) {
  return (
    <section className="hero-section">
      <div className="hero-glow" />
      <div className="container hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Welcome to <span className="text-gradient">DevPulse</span>
          </h1>
          <p className="hero-subtitle">
            A vibrant hub for{" "}
            <span style={{ color: "var(--accent)", fontWeight: "bold" }}>
              developers
            </span>
            ,{" "}
            <span style={{ color: "var(--secondary)", fontWeight: "bold" }}>
              creators
            </span>
            , and{" "}
            <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
              dreamers
            </span>
            .
          </p>
        </div>
        <div className="hero-search-wrapper">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              className="hero-search-input"
              value={searchQuery || ""}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
