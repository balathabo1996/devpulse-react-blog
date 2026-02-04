import { Code, Cpu, Globe, Zap } from "lucide-react";

/** About Page Component. */
export function About() {
  return (
    <div className="layout-grid">
      <div className="widget" style={{ gridColumn: "1 / -1" }}>
        <h1
          className="hero-title"
          style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}
        >
          About <span className="text-gradient">DevPulse</span>
        </h1>

        <p
          className="detail-body"
          style={{ marginBottom: "2rem", maxWidth: "800px" }}
        >
          DevPulse is a cutting-edge blog dedicated to the latest in software
          development, technology trends, and coding best practices. Our mission
          is to empower developers with actionable insights and inspiring
          content.
        </p>

        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
          alt="Team collaborating"
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "var(--radius)",
            marginBottom: "3rem",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          <div
            className="widget"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "rgba(15, 23, 42, 0.3)",
            }}
          >
            <div style={{ color: "var(--primary)", marginBottom: "1rem" }}>
              <Code size={32} />
            </div>
            <h3
              className="widget-title"
              style={{ border: "none", marginBottom: "0.5rem" }}
            >
              Clean Code
            </h3>
            <p className="widget-empty">
              We believe in writing code that is not just functional, but also
              readable, maintainable, and elegant.
            </p>
          </div>

          <div
            className="widget"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "rgba(15, 23, 42, 0.3)",
            }}
          >
            <div style={{ color: "var(--secondary)", marginBottom: "1rem" }}>
              <Zap size={32} />
            </div>
            <h3
              className="widget-title"
              style={{ border: "none", marginBottom: "0.5rem" }}
            >
              Innovation
            </h3>
            <p className="widget-empty">
              Staying ahead of the curve with the latest frameworks, tools, and
              methodologies in the tech world.
            </p>
          </div>

          <div
            className="widget"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "rgba(15, 23, 42, 0.3)",
            }}
          >
            <div style={{ color: "var(--accent)", marginBottom: "1rem" }}>
              <Globe size={32} />
            </div>
            <h3
              className="widget-title"
              style={{ border: "none", marginBottom: "0.5rem" }}
            >
              Community
            </h3>
            <p className="widget-empty">
              Building a vibrant community of developers who share knowledge,
              helping each other grow.
            </p>
          </div>

          <div
            className="widget"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "rgba(15, 23, 42, 0.3)",
            }}
          >
            <div style={{ color: "#10b981", marginBottom: "1rem" }}>
              <Cpu size={32} />
            </div>
            <h3
              className="widget-title"
              style={{ border: "none", marginBottom: "0.5rem" }}
            >
              Technology
            </h3>
            <p className="widget-empty">
              Deep dives into the underlying technologies that power the modern
              web and beyond.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Join the Journey
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
            Whether you are a beginner or a seasoned pro, there is always
            something new to learn at DevPulse.
          </p>
        </div>
      </div>
    </div>
  );
}
