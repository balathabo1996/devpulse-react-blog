// About Page: Displays information about the blog and its authors
import { Code, Cpu, Globe, Zap } from "lucide-react";

// About Page Component.
export function About() {
  return (
    <div className="layout-grid">
      <div className="widget widget-full-width">
        <h1 className="hero-title page-title">
          About <span className="text-gradient">DevPulse</span>
        </h1>

        <p className="detail-body page-description">
          DevPulse is a cutting-edge blog dedicated to the latest in software
          development, technology trends, and coding best practices. Our mission
          is to empower developers with actionable insights and inspiring
          content.
        </p>

        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
          alt="Team collaborating"
          className="hero-image-full"
        />

        <div className="feature-grid">
          <div className="widget feature-card">
            <div className="feature-icon primary">
              <Code size={32} />
            </div>
            <h3 className="widget-title feature-title">Clean Code</h3>
            <p className="widget-empty">
              We believe in writing code that is not just functional, but also
              readable, maintainable, and elegant.
            </p>
          </div>

          <div className="widget feature-card">
            <div className="feature-icon secondary">
              <Zap size={32} />
            </div>
            <h3 className="widget-title feature-title">Innovation</h3>
            <p className="widget-empty">
              Staying ahead of the curve with the latest frameworks, tools, and
              methodologies in the tech world.
            </p>
          </div>

          <div className="widget feature-card">
            <div className="feature-icon accent">
              <Globe size={32} />
            </div>
            <h3 className="widget-title feature-title">Community</h3>
            <p className="widget-empty">
              Building a vibrant community of developers who share knowledge,
              helping each other grow.
            </p>
          </div>

          <div className="widget feature-card">
            <div className="feature-icon success">
              <Cpu size={32} />
            </div>
            <h3 className="widget-title feature-title">Technology</h3>
            <p className="widget-empty">
              Deep dives into the underlying technologies that power the modern
              web and beyond.
            </p>
          </div>
        </div>

        <div className="join-section">
          <h2 className="join-title">Join the Journey</h2>
          <p className="join-text">
            Whether you are a beginner or a seasoned pro, there is always
            something new to learn at DevPulse.
          </p>
        </div>
      </div>
    </div>
  );
}
