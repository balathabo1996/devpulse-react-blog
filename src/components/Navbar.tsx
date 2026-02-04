import { Terminal } from "lucide-react";
import React from "react";

interface NavbarProps {
  onNavigate: (
    view: "home" | "posts" | "categories" | "about" | "contact",
  ) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const handleNavClick = (
    e: React.MouseEvent,
    view: "home" | "posts" | "categories" | "about" | "contact",
  ) => {
    e.preventDefault();
    onNavigate(view);
  };

  return (
    <nav
      className="navbar glass"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "1rem 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a
          href="#"
          onClick={(e) => handleNavClick(e, "home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: "bold",
            fontSize: "1.5rem",
            textDecoration: "none",
          }}
        >
          <Terminal size={28} color="var(--primary)" />
          <span className="text-gradient">DevPulse</span>
        </a>
        <ul
          style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <a
              href="#"
              onClick={(e) => handleNavClick(e, "home")}
              style={{
                fontWeight: 600,
                color: "var(--text)",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => handleNavClick(e, "posts")}
              style={{
                fontWeight: 600,
                color: "var(--text)",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Posts
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => handleNavClick(e, "categories")}
              style={{
                fontWeight: 600,
                color: "var(--text)",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Categories
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => handleNavClick(e, "about")}
              style={{
                fontWeight: 600,
                color: "var(--text)",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => handleNavClick(e, "contact")}
              style={{
                fontWeight: 600,
                color: "var(--text)",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
