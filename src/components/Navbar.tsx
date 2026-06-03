// Navbar: Top navigation bar with branding and links
import { Terminal, LogIn, LogOut, Settings, User, ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Props for the Navbar component.
interface NavbarProps {
  currentView: "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings" | "profile";
  onNavigate: (
    view: "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings" | "profile",
    reset?: boolean,
  ) => void;
}

const NAV_ITEMS = ["Home", "Posts", "About", "Contact"] as const;

// Sticky Navigation Bar with glassmorphism effects and internal routing.
export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
