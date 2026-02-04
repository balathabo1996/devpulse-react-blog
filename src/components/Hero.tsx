/** Hero section with gradient text and glow background. */
export function Hero() {
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
          <input
            type="text"
            placeholder="Search articles..."
            className="hero-search-input"
          />
        </div>
      </div>
    </section>
  );
}
