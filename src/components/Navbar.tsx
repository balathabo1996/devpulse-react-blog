// Navbar: Top navigation bar with branding and links
import { Terminal, LogIn, LogOut, Settings, User, ChevronDown, Search, Filter } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Props for the Navbar component.
interface NavbarProps {
  currentView: "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings" | "profile";
  onNavigate: (
    view: "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings" | "profile",
    reset?: boolean,
  ) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  categories?: string[];
  selectedCategory?: string | null;
  onCategorySelect?: (category: string | null) => void;
}

const NAV_ITEMS = ["Home", "Posts", "About", "Contact"] as const;

// Sticky Navigation Bar with glassmorphism effects and internal routing.
export function Navbar({ 
  currentView, 
  onNavigate,
  searchQuery,
  onSearch,
  categories,
  selectedCategory,
  onCategorySelect
}: NavbarProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent,
    view: "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings" | "profile",
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
          <div className="logo-icon-wrapper">
            <Terminal size={22} className="logo-icon" />
          </div>
          <span className="logo-text">
            Dev<span className="logo-text-highlight">Pulse</span>
          </span>
        </a>
        <ul className="navbar-links">
          {NAV_ITEMS.map((item) => {
            const view = item.toLowerCase() as "home" | "posts" | "about" | "contact";
            const isActive = currentView === view;
            return (
              <li key={item}>
                <a
                  href="#"
                  onClick={(e) => handleNavClick(e, view)}
                  className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                >
                  {item}
                  {isActive && <span className="nav-link-indicator" />}
                </a>
              </li>
            );
          })}

          <li className="nav-search-container" style={{ position: 'relative', marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
            <div className={`nav-search-wrapper ${isSearchActive || searchQuery ? 'active' : ''}`}>
              <Search size={16} className="nav-search-icon" />
              <input
                type="text"
                placeholder="Search articles..."
                className="nav-search-input"
                value={searchQuery || ""}
                onChange={(e) => onSearch?.(e.target.value)}
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => setIsSearchActive(false)}
              />
            </div>
            
            {categories && categories.length > 0 && (
              <div ref={categoryRef} style={{ position: 'relative', marginLeft: '0.5rem' }}>
                <button 
                  className={`nav-category-btn ${selectedCategory ? 'active' : ''}`}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  title="Filter by Category"
                >
                  <Filter size={16} />
                </button>
                
                {isCategoryOpen && (
                  <div className="nav-category-menu animate-fade-in glass">
                    <button 
                      className={`nav-category-item ${!selectedCategory ? 'active' : ''}`}
                      onClick={() => { onCategorySelect?.(null); setIsCategoryOpen(false); }}
                    >
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        className={`nav-category-item ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => { onCategorySelect?.(cat); setIsCategoryOpen(false); }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </li>

          {user ? (
            <li className="nav-user-info nav-auth-item" ref={dropdownRef} style={{ position: 'relative', marginLeft: '1rem' }}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="profile-dropdown-trigger"
              >
                <div className="profile-avatar">
                  {user.photoURL && !imageError ? (
                    <img 
                      src={user.photoURL} 
                      alt="" 
                      onError={() => setImageError(true)} 
                    />
                  ) : (
                    <span className="profile-initial">
                      {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="nav-username">
                  {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}
                </span>
                <ChevronDown size={14} className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="profile-dropdown-menu animate-fade-in">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user?.displayName || "Developer"}</p>
                    <p className="dropdown-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  {user.email === import.meta.env.VITE_ADMIN_EMAIL && (
                    <button onClick={() => { onNavigate("admin"); setIsDropdownOpen(false); }} className="dropdown-item">
                      <Terminal size={16} /> Admin Portal
                    </button>
                  )}
                  
                  <button onClick={() => { onNavigate("profile"); setIsDropdownOpen(false); }} className="dropdown-item">
                    <User size={16} /> My Profile
                  </button>
                  
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={() => { logout(); setIsDropdownOpen(false); }} 
                    className="dropdown-item dropdown-logout"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li className="nav-auth-item" style={{ marginLeft: '1rem' }}>
              <button onClick={() => onNavigate("login")} className={`btn ${currentView === 'login' ? 'btn-primary' : 'btn-ghost nav-login-btn'}`} style={{ padding: '0.5rem 1rem' }}>
                <LogIn size={16} className="icon-margin-right" /> Login
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
