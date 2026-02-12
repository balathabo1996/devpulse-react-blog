// Layout: Main application layout wrapper
import React from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Footer } from "./Footer";

// Props for the Layout component.
interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-wrapper">
      <Navbar />
      <Hero />
      <main className="container main-content">{children}</main>
      <Footer />
    </div>
  );
}
