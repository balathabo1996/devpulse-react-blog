// Hero Section: large banner/intro section on the home page
import { Search } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/** Hero section with gradient text and glow background. */
export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (typeof router.query.q === "string") {
      setQuery(router.query.q);
    } else {
      setQuery("");
    }
  }, [router.query.q]);

  const handleSearch = (val: string) => {
    setQuery(val);
    // If on home page, update URL. If not, maybe redirect to home?
    // Original behavior: typing redirects to home.
    // Here we can instruct user to press enter or debounce.
    // For simplicity and "live" feel:
    if (router.pathname !== "/") {
       router.push({ pathname: "/", query: { q: val } });
    } else {
       router.replace({ pathname: "/", query: { ...router.query, q: val } }, undefined, { shallow: true });
    }
  };

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
        <div className="hero-search-wrapper">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              className="hero-search-input"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
