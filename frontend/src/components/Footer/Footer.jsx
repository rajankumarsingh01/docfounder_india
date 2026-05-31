import { Link, useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="ft-root">

      <div className="ft-glow ft-glow-1" />
      <div className="ft-glow ft-glow-2" />

      <div className="ft-container">

        {/* Brand */}
        <div className="ft-brand">
          <div className="ft-logo" onClick={() => navigate("/")}>
            <span className="ft-logo-icon">📄</span>
            <span className="ft-logo-text">
              Doc<span>Finder</span>
            </span>
          </div>

          <p className="ft-tagline">
            India’s smart Lost & Found Document platform.
          </p>

          <div className="ft-social">
            <a href="#" className="ft-social-btn">📘</a>
            <a href="#" className="ft-social-btn">🐦</a>
            <a href="#" className="ft-social-btn">💼</a>
            <a href="#" className="ft-social-btn">📸</a>
          </div>
        </div>

        {/* Links */}
        <div className="ft-links">
          <h4>Quick Links</h4>
          <Link to="/">Search Documents</Link>
          <Link to="/upload">Upload Found Doc</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/my-documents">My Uploads</Link>
        </div>

        {/* Info */}
        <div className="ft-links">
          <h4>How it works</h4>
          <p>1. Upload found document</p>
          <p>2. Owner searches</p>
          <p>3. Claim verification</p>
          <p>4. Safe return</p>
        </div>

        {/* CTA */}
        <div className="ft-cta">
          <h4>Help Someone Today</h4>
          <p>Every upload increases chance of returning lost documents.</p>

          <button className="ft-btn" onClick={() => navigate("/upload")}>
            + Upload Now
          </button>
        </div>

      </div>

      {/* Bottom */}
      <div className="ft-bottom">
        <p>
          Made with <span className="ft-heart">❤️</span> by{" "}
          <strong>Rajan Kumar Singh</strong>
        </p>

        <p className="ft-copy">© {year} DocFinder. All Rights Reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;