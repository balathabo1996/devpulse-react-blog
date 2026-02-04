import { Terminal } from "lucide-react";
import React from "react";

/** Props for the Navbar component. */
interface NavbarProps {
  onNavigate: (
    view: "home" | "posts" | "categories" | "about" | "contact",
    reset?: boolean,
  ) => void;
}

/** Sticky Navigation Bar with glassmorphism effects and internal routing. */
export function Navbar({ onNavigate }: NavbarProps) {
  const handleNavClick = (
    e: React.MouseEvent,
    view: "home" | "posts" | "categories" | "about" | "contact",
  ) => {
    e.preventDefault();
    onNavigate(view, true); // Always reset filters when clicking nav items
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <a
          href="#"
          onClick={(e) => handleNavClick(e, "home")}
          className="navbar-logo"
        >
          <Terminal size={28} color="var(--primary)" />
          <span className="text-gradient">DevPulse</span>
        </a>
        <ul className="navbar-links">
          {["Home", "Posts", "Categories", "About", "Contact"].map((item) => (
            <li key={item}>
              <a
                href="#"
                onClick={(e) => handleNavClick(e, item.toLowerCase() as any)}
                className="nav-link"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
