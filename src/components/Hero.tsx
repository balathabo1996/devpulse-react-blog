export function Hero() {
  return (
    <section
      style={{
        background:
          "radial-gradient(circle at center, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 1) 100%)",
        padding: "4rem 2rem",
        borderBottom: "1px solid var(--border)",
        marginBottom: "2rem",
        borderRadius: "var(--radius)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow effect */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />

      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "left", maxWidth: "600px" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              marginBottom: "0.5rem",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            Welcome to <span className="text-gradient">DevPulse</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-muted)" }}>
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
        <div style={{ flex: 1, maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="Search posts..."
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--text)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
