import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Smile,
  BookOpen,
  MessageCircle,
  Leaf,
  Wind,
  TrendingUp,
  Users,
  Sun,
  Moon,
  LogOut,
  User,
  Menu,
  Settings,
  X,
} from "lucide-react";

export default function Navigation({
  userName,
  onLogout,
  onThemeToggle,
  theme,
  isAuth,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ Scroll detection for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Mobile menu ko body scroll rokne ke liye
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    onLogout();
  };

  const handleThemeToggle = () => {
    onThemeToggle();
    const newTheme = theme === "light" ? "dark" : "light";
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    closeMobileMenu();
  };

  return (
    <>
      <nav className={`navigation-main ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* Logo/Brand - Always visible */}
          <Link
            to={isAuth ? "/dashboard" : "/"}
            className="nav-brand"
            onClick={closeMobileMenu}
          >
            <div className="brand-logo-container">
              <img
                src="/images/logo.png"
                alt="Mental Wellness Logo"
                className="brand-logo rounded-4xl"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            </div>
            <span className="brand-text">Mental Wellness</span>
          </Link>

          {/* ✅ FIXED: Single container for non-auth users */}
          {isAuth ? (
            // Authenticated users ke liye desktop navigation
            <div className="nav-links-desktop">
              <DesktopNavLinks
                onLogout={onLogout}
                onThemeToggle={handleThemeToggle}
                theme={theme}
              />
            </div>
          ) : (
            // ✅ NON-AUTHENTICATED USERS - Single container for both desktop and mobile
            <div className="nav-actions-unified">
              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className="nav-action-btn theme-toggle-btn"
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* Login Button */}
              <Link
                to="/login"
                className="nav-action-btn login-btn"
                title="Login"
              >
                <User size={18} />
              </Link>
            </div>
          )}

          {/* ✅ User Info & Mobile Menu Button - Only for authenticated users */}
          <div className="nav-user-section">
            {isAuth ? (
              <>
                <div className="user-info-desktop">
                  <div className="user-avatar">
                    <User size={16} />
                  </div>
                  {/* <span className="user-greeting">
                    Hi, {userName || "User"}
                  </span> */}
                </div>

                {/* Mobile Menu Button - Only for authenticated users */}
                <button
                  className="mobile-menu-btn"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Only show when authenticated */}
      {isAuth && (
        <div className={`nav-links-mobile ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu-header">
            <div className="mobile-user-info">
              <div className="user-avatar-large">
                <User size={20} />
              </div>
              <div className="user-details">
                <span className="user-name">{userName || "User"}</span>
                <span className="user-email">Welcome back!</span>
              </div>
            </div>
            <button
              className="close-mobile-menu"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <MobileNavLinks
            onLogout={handleLogout}
            onThemeToggle={handleThemeToggle}
            theme={theme}
            onLinkClick={closeMobileMenu}
          />
        </div>
      )}

      {/* Mobile Menu Overlay - Only show when authenticated and menu open */}
      {isMobileMenuOpen && isAuth && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </>
  );
}

// Desktop Navigation Links - Only for authenticated users
function DesktopNavLinks({ onLogout, onThemeToggle, theme }) {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/mood-tracker", label: "Mood", icon: Smile },
    { path: "/journal", label: "Journal", icon: BookOpen },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/meditation", label: "Meditate", icon: Leaf },
    { path: "/breathing", label: "Breathe", icon: Wind },
    { path: "/progress", label: "Progress", icon: TrendingUp },
    { path: "/community", label: "Community", icon: Users },
    // ✅ NEW LINKS ADD KARO
    { path: "/profile", label: "Profile", icon: User },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="nav-links-desktop-container">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Link key={item.path} to={item.path} className="nav-link-desktop">
            <IconComponent className="nav-icon" size={18} />
             /* {/* <span className="nav-label">{item.label}</span> */} */
          </Link>
        );
      })}

      <div className="nav-actions-desktop">
        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="nav-action-btn theme-toggle-btn"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="nav-action-btn logout-btn"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

// Mobile Navigation Links - Only for authenticated users
function MobileNavLinks({ onLogout, onThemeToggle, theme, onLinkClick }) {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/mood-tracker", label: "Mood Tracker", icon: Smile },
    { path: "/journal", label: "Journal", icon: BookOpen },
    { path: "/chat", label: "Chat Assistant", icon: MessageCircle },
    { path: "/meditation", label: "Meditation", icon: Leaf },
    { path: "/breathing", label: "Breathing", icon: Wind },
    { path: "/progress", label: "Progress", icon: TrendingUp },
    { path: "/community", label: "Community", icon: Users },
    // ✅ NEW LINKS ADD KARO
    { path: "/profile", label: "Profile", icon: User },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="nav-links-mobile-container">
      <div className="mobile-nav-section">
        <h3 className="mobile-section-title">Navigation</h3>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="nav-link-mobile"
              onClick={handleLinkClick}
            >
              <IconComponent className="nav-icon" size={20} />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mobile-actions">
        <h3 className="mobile-section-title">Settings</h3>

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="nav-link-mobile theme-toggle-btn"
        >
          {theme === "light" ? (
            <Moon className="nav-icon" size={20} />
          ) : (
            <Sun className="nav-icon" size={20} />
          )}
          <span className="nav-label">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>

        {/* Logout Button */}
        <button onClick={onLogout} className="nav-link-mobile logout-btn">
          <LogOut className="nav-icon" size={20} />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
}
