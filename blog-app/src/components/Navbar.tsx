// Navbar: Top navigation bar with branding and links
import Link from "next/link";
import { Terminal } from "lucide-react";
import React from "react";
import { useRouter } from "next/router";

/** Sticky Navigation Bar with glassmorphism effects and internal routing. */
export function Navbar() {
  const router = useRouter();

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link href="/" className="navbar-logo">
          <Terminal size={28} color="var(--primary)" />
          <span className="text-gradient">DevPulse</span>
        </Link>
        <ul className="navbar-links">
          <li>
            <Link
              href="/"
              className={`nav-link ${router.pathname === "/" ? "text-primary" : ""}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/posts"
              className={`nav-link ${router.pathname.startsWith("/posts") ? "text-primary" : ""}`}
            >
              Posts
            </Link>
          </li>
          <li>
            <Link
              href="/categories"
              className={`nav-link ${router.pathname === "/categories" ? "text-primary" : ""}`}
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`nav-link ${router.pathname === "/about" ? "text-primary" : ""}`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`nav-link ${router.pathname === "/contact" ? "text-primary" : ""}`}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
