import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

/* ── SVG icon shortcuts ──────────────────────────────────── */
const IC = {
  search: (
    <>
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
    </>
  ),
  docs: (
    <>
      <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8L14 2z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  upload: (
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  signout: (
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  plus: (
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
  ),
  arrow: (
    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  chevron: (
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  logo: (
    <>
      <path d="M14 2H6C5.47 2 4.96 2.21 4.59 2.59C4.21 2.96 4 3.47 4 4v16c0 .53.21 1.04.59 1.41C4.96 21.79 5.47 22 6 22h12c.53 0 1.04-.21 1.41-.59C19.79 21.04 20 20.53 20 20V8L14 2z"
        stroke="#e8352a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke="#e8352a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
};

function Svg({ d, size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">{d}</svg>
  );
}

/* ── Nav Link ────────────────────────────────────────────── */
function NavItem({ to, label, icon, active }) {
  const ref = useRef(null);

  function addRipple(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rip  = document.createElement("span");
    rip.className = "nl-ripple";
    rip.style.left = (e.clientX - rect.left) + "px";
    rip.style.top  = (e.clientY - rect.top)  + "px";
    el.appendChild(rip);
    setTimeout(() => rip.remove(), 600);
  }

  return (
    <Link ref={ref} to={to} className={`nl${active ? " active" : ""}`} onClick={addRipple}>
      <Svg d={icon} size={12} />
      {label}
      {active && <span className="nl-bar" />}
    </Link>
  );
}

/* ── Dropdown Item ───────────────────────────────────────── */
function DropItem({ to, icon, label, hint, accent, onClick }) {
  return (
    <Link to={to} className={`di${accent ? " accent" : ""}`} onClick={onClick}>
      <span className="di-ic"><Svg d={icon} size={13} /></span>
      <span className="di-text">
        <span className="di-label">{label}</span>
        {hint && <span className="di-hint">{hint}</span>}
      </span>
      <span className="di-arr">→</span>
    </Link>
  );
}

/* ── Mobile Link ─────────────────────────────────────────── */
function MobLink({ to, icon, children, active, upload, onClick }) {
  const cls = ["ml", active ? "active" : "", upload ? "upload-m" : ""].filter(Boolean).join(" ");
  return (
    <Link to={to} className={cls} onClick={onClick}>
      <Svg d={icon} size={15} />
      {children}
      {active && <span className="ml-dot" />}
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════════════════════ */
export default function Navbar() {
  const navigate        = useNavigate();
  const location        = useLocation();
  const { user, logout } = useAuth();

  const [dropOpen, setDropOpen] = useState(false);
  const [mobOpen,  setMobOpen]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hideNav,  setHideNav]  = useState(false);
  const lastY = useRef(0);

  const dropRef = useRef(null);

  /* Scroll behaviour */
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 16);
      setHideNav(y > lastY.current && y > 60);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    function outside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  /* Close menus on route change */
  useEffect(() => { setMobOpen(false); setDropOpen(false); }, [location.pathname]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = mobOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobOpen]);

const isActive = (p) => location.pathname.startsWith(p);
  const initial  = user?.name?.charAt(0).toUpperCase() || "U";
  const firstName = user?.name?.split(" ")[0] || "";

  const navCls = [
    "nb",
    scrolled                          ? "scrolled"  : "",
    hideNav && !mobOpen               ? "nb-hidden" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <nav className={navCls}>
        <div className="nb-line" />

        <div className="nb-inner">

          {/* ── Logo ── */}
        <Link to="/" className="logo">
  <div className="logo-icon">
    <Svg d={IC.logo} size={15} />
  </div>

  {/* <div className="logo-text">
    <span className="logo-doc">Doc</span>
    <span className="logo-finder">Finder</span>
  </div> */}

  <div
  style={{
    display: "flex",
    flexDirection: "column",
    lineHeight: "1.05",
    marginLeft: "8px",
  }}
>
  <span
    style={{
      fontSize: "16px",
      fontWeight: "800",
      letterSpacing: "0.5px",
      background: "linear-gradient(90deg, #ff3d3d, #ff7a18)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    DocFinder
  </span>

 
</div>

</Link>

          {/* ── Desktop Links ── */}
          <nav className="nb-links" aria-label="Main navigation">
        <NavItem
  to="/"
  label="Find Documents"
  icon={IC.search}
  active={isActive("/")}
/>
            {user && (
              <>
             <NavItem
  to="/dashboard"
  label="Overview"
  icon={IC.dashboard}
  active={isActive("/dashboard")}
/>
              </>
            )}
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="nb-actions">
            {user ? (
              <>
                {/* Upload button */}
                <Link to="/upload" className="btn-up">
                  <span className="btn-up-plus">
                    <Svg d={IC.plus} size={9} />
                  </span>
                  Upload Found Doc
                  <span className="btn-up-shine" />
                </Link>

                {/* User pill */}
                <div
                  className="user-pill"
                  ref={dropRef}
                  onClick={() => setDropOpen((v) => !v)}
                >
                  <div className="u-av">
                    {initial}
                    <div className="u-online" />
                  </div>
                  <span className="u-name">{firstName}</span>
                  <svg
                    className={`chevron${dropOpen ? " open" : ""}`}
                    width="10" height="10" viewBox="0 0 24 24" fill="none"
                  >
                    {IC.chevron}
                  </svg>

                  {/* Dropdown */}
                  {dropOpen && (
                    <div className="drop" onClick={(e) => e.stopPropagation()}>
                      <div className="drop-head">
                        <div className="drop-av">{initial}</div>
                        <div className="drop-info">
                          <p className="drop-name">{user.name}</p>
                          <p className="drop-email">{user.email}</p>
                        </div>
                        <div className="drop-status">
                          <span className="drop-dot" />
                          Online
                        </div>
                      </div>

                      <div className="drop-sec">
                        <DropItem to="/dashboard"    icon={IC.dashboard} label="Dashboard"  hint="View your stats"   onClick={() => setDropOpen(false)} />
                        <DropItem to="/my-documents" icon={IC.docs}      label="My Uploads" hint="Manage documents"  onClick={() => setDropOpen(false)} />
                        <DropItem to="/upload"       icon={IC.upload}    label="Upload Doc" hint="Found a document?" accent onClick={() => setDropOpen(false)} />
                      </div>

                      <div className="drop-div" />

                      <div className="drop-sec">
                        <button className="di danger" onClick={() => { logout(); navigate("/login"); }}>
                          <span className="di-ic"><Svg d={IC.signout} size={13} /></span>
                          <span className="di-text"><span className="di-label">Sign Out</span></span>
                          <span className="di-arr">→</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost">Sign In</Link>
                <Link to="/register" className="btn-up">
                  Get Started
                  <Svg d={IC.arrow} size={10} />
                  <span className="btn-up-shine" />
                </Link>
              </>
            )}
          </div>

          {/* ── Hamburger ── */}
          <button
            className={`ham${mobOpen ? " open" : ""}`}
            onClick={() => setMobOpen((v) => !v)}
            aria-label={mobOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        {/* ── Mobile Drawer ── */}
        <div className={`mob-drawer${mobOpen ? " open" : ""}`} aria-hidden={!mobOpen}>
          <div className="mob-inner">

            <MobLink to="/search" icon={IC.search} active={isActive("/search") || isActive("/")} onClick={() => setMobOpen(false)}>
              Search Documents
            </MobLink>

            {user ? (
              <>
                <MobLink to="/dashboard"    icon={IC.dashboard} active={isActive("/dashboard")}    onClick={() => setMobOpen(false)}>Dashboard</MobLink>
                <MobLink to="/my-documents" icon={IC.docs}      active={isActive("/my-documents")} onClick={() => setMobOpen(false)}>My Uploads</MobLink>
                <MobLink to="/upload"       icon={IC.upload}    upload                             onClick={() => setMobOpen(false)}>Upload Found Doc</MobLink>

                <div className="mob-div" />

                <div className="mob-user">
                  <div className="mob-av">
                    {initial}
                    <div className="mob-av-online" />
                  </div>
                  <div>
                    <p className="mob-uname">{user.name}</p>
                    <p className="mob-email">{user.email}</p>
                  </div>
                </div>

                <button
                  className="ml danger-m"
                  onClick={() => { logout(); navigate("/login"); setMobOpen(false); }}
                >
                  <Svg d={IC.signout} size={15} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="mob-auth">
                <Link to="/login"    className="mob-ghost"   onClick={() => setMobOpen(false)}>Sign In</Link>
                <Link to="/register" className="mob-primary" onClick={() => setMobOpen(false)}>Get Started →</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {mobOpen && (
        <div className="nb-backdrop" onClick={() => setMobOpen(false)} aria-hidden="true" />
      )}
    </>
  );
}



