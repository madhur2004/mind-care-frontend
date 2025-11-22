import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ React Router DOM Link
import { Heart, Send, ArrowRight } from "lucide-react";

export default function InteractiveFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", to: "#" },
        { name: "Pricing", to: "#" },
        { name: "Blog", to: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", to: "#" },
        { name: "Careers", to: "#" },
        { name: "Contact", to: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", to: "#" },
        { name: "Community", to: "#" },
        { name: "FAQ", to: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", to: "#" },
        { name: "Terms of Service", to: "#" },
        { name: "Cookie Policy", to: "#" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Twitter", icon: "𝕏", href: "https://x.com/Madhur032004" },
    {
      name: "Facebook",
      icon: "f",
      href: "https://www.facebook.com/share/169LTygwAi/",
    },
    {
      name: "Instagram",
      icon: "📷",
      href: "https://www.instagram.com/chaturvedi__2004/",
    },
    { name: "LinkedIn", icon: "in", href: "https://linkedin.com" },
  ];

  return (
    <footer className="footer-container">
      {/* Newsletter */}
      <div className="footer-newsletter">
        <div className="footer-newsletter-content">
          <div className="footer-newsletter-text">
            <h3>Join Our Wellness Community</h3>
            <p>
              Get daily wellness tips, meditation guides, and mental health
              insights delivered to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="footer-newsletter-form">
            <div className="footer-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="footer-email-input"
              />
              <button
                type="submit"
                className={`footer-subscribe-btn ${
                  subscribed ? "subscribed" : ""
                }`}
              >
                {subscribed ? (
                  <>
                    <Heart size={18} /> Subscribed!
                  </>
                ) : (
                  <>
                    <Send size={18} /> Subscribe
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <h2>Mental Wellness</h2>
            <p className="footer-tagline">
              Care for your mind, nurture your soul
            </p>
          </div>
          <div className="footer-social">
            <p className="footer-social-title">Connect With Us</p>
            <div className="footer-social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  title={social.name}
                  onMouseEnter={() => setHoveredLink(social.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span>{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="footer-links-grid">
          {footerSections.map((section) => (
            <div key={section.title} className="footer-section">
              <h4 className="footer-section-title">{section.title}</h4>
              <ul className="footer-links-list">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to} // ✅ React Router uses `to` prop
                      className="footer-link"
                      onMouseEnter={() => setHoveredLink(link.name)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <span>{link.name}</span>
                      {hoveredLink === link.name && <ArrowRight size={14} />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            &copy; 2025 Mental Wellness. Built with{" "}
            <span className="footer-heart">
              <Heart size={14} />
            </span>
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy" className="footer-bottom-link">
              Privacy
            </Link>
            <span className="footer-divider">•</span>
            <Link to="/terms" className="footer-bottom-link">
              Terms
            </Link>
            <span className="footer-divider">•</span>
            <Link to="/sitemap" className="footer-bottom-link">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
