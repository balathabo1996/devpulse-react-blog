// Hero Section: large banner/intro section on the home page
import { Search } from "lucide-react";

interface HeroProps {
  // Add future props if needed
}

// Hero section with gradient text and glow background.
export function Hero({}: HeroProps = {}) {
  return (
    <section className="hero-section">
      <div className="hero-glow" />
      <div className="container hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Welcome to <span className="text-gradient">DevPulse</span>
          </h1>
          <p className="hero-subtitle">
            A vibrant hub for <span className="text-accent">developers</span>,{" "}
            <span className="text-secondary">creators</span>, and{" "}
            <span className="text-primary">dreamers</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
