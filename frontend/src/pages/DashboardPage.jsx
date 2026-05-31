import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./DashboardPage.css";

/* ─── Animated Counter ─────────────────────────────────────────── */
function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (value == null) return;
    const start = performance.now();
    const from = 0;
    const to = value;
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * ease));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return <span>{display}</span>;
}

/* ─── Particle Canvas ───────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, particles, raf;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      resize();
      particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.05,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,53,42,${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="db-particle-canvas" />;
}

/* ─── Stat Card ─────────────────────────────────────────────────── */
function StatCard({ icon, label, value, accent, accentRgb, onClick, clickable, delay = 0, badge }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`db-stat-card ${visible ? "db-stat-visible" : ""} ${clickable ? "db-stat-clickable" : ""}`}
      onClick={clickable ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        "--accent": accent,
        "--accent-rgb": accentRgb,
      }}
    >
      {/* Glow orb behind card */}
      <div className="db-card-orb" />

      {/* Top row */}
      <div className="db-card-top">
        <div className="db-card-icon" style={{ background: `rgba(${accentRgb},0.12)` }}>
          <span className="db-card-icon-inner">{icon}</span>
        </div>
        {badge && (
          <span className="db-card-badge" style={{ background: `rgba(${accentRgb},0.15)`, color: accent }}>
            {badge}
          </span>
        )}
        {clickable && (
          <span className="db-card-arrow" style={{ opacity: hovered ? 1 : 0 }}>→</span>
        )}
      </div>

      <p className="db-card-label">{label}</p>

      <div className="db-card-value">
        <AnimatedNumber value={value ?? 0} />
      </div>

      {/* Accent line */}
      <div className="db-card-line" style={{ background: accent }} />

      {/* 3D perspective grid overlay */}
      <div className="db-card-grid" />
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="db-skeleton-card">
      <div className="db-shimmer db-sk-icon" />
      <div className="db-shimmer db-sk-label" />
      <div className="db-shimmer db-sk-value" />
    </div>
  );
}

/* ─── Activity Item ─────────────────────────────────────────────── */
function ActivityItem({ icon, text, time, accent }) {
  return (
    <div className="db-activity-item">
      <div className="db-activity-dot" style={{ background: accent }} />
      <span className="db-activity-icon">{icon}</span>
      <span className="db-activity-text">{text}</span>
      <span className="db-activity-time">{time}</span>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    fetchDashboard();
    const t = setTimeout(() => setHeaderVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/documents/dashboard");
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const CARDS = stats
    ? [
        {
          icon: "📤",
          label: "Total Uploads",
          value: stats.totalUploads,
          accent: "#378ADD",
          accentRgb: "55,138,221",
          clickable: true,
          onClick: () => navigate("/my-documents"),
          delay: 0,
        },
        {
          icon: "📄",
          label: "Found Documents",
          value: stats.foundDocuments,
          accent: "#639922",
          accentRgb: "99,153,34",
          clickable: true,
          onClick: () => navigate("/my-documents?filter=FOUND"),
          delay: 80,
        },
        {
          icon: "🔔",
          label: "Pending Claims",
          value: stats.pendingClaims,
          accent: "#EF9F27",
          accentRgb: "239,159,39",
          clickable: stats.pendingClaims > 0,
          onClick: () => navigate("/my-documents?filter=PENDING_CLAIM"),
          delay: 160,
          badge: stats.pendingClaims > 0 ? "Action needed" : null,
        },
        {
          icon: "✅",
          label: "Claimed",
          value: stats.claimedDocuments,
          accent: "#1D9E75",
          accentRgb: "29,158,117",
          clickable: false,
          delay: 240,
        },
      ]
    : [];

  const quickLinks = [
    { label: "My Uploads", path: "/my-documents", icon: "📁" },
    { label: "Search Documents", path: "/search", icon: "🔍" },
    { label: "Upload New", path: "/upload", icon: "⬆️" },
  ];

  return (
    <div className="db-root">
      <ParticleField />

      {/* Background radial glow */}
      <div className="db-bg-glow db-glow-1" />
      <div className="db-bg-glow db-glow-2" />
      <div className="db-bg-grid" />

      <div className="db-container">


        <button
  onClick={() => navigate("/")}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "6px 12px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "13px",
    cursor: "pointer",
    marginBottom: "10px",
    backdropFilter: "blur(10px)",
    transition: "0.2s ease",
  }}
  onMouseOver={(e) => (e.target.style.transform = "translateX(-2px)")}
  onMouseOut={(e) => (e.target.style.transform = "translateX(0px)")}
>
  ← Back
</button>

        {/* ── Header ── */}
        <div className={`db-header ${headerVisible ? "db-header-visible" : ""}`}>
          <div className="db-header-left">
            <div className="db-eyebrow">
              <span className="db-eyebrow-dot" />
              DocFinder Overview
            </div>
            <h1 className="db-title">Dashboard</h1>
            <p className="db-subtitle">Track your found document activity in real-time</p>
          </div>
          <div className="db-header-right">
            <button className="db-upload-btn" onClick={() => navigate("/upload")}>
              <span className="db-upload-btn-icon">+</span>
              Upload Document
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="db-cards-grid">
          {loading
            ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
            : CARDS.map((c) => <StatCard key={c.label} {...c} />)}
        </div>

        {/* ── Pending Claims Alert ── */}
        {!loading && stats?.pendingClaims > 0 && (
          <div className="db-alert db-alert-warning">
            <div className="db-alert-pulse" />
            <div className="db-alert-left">
              <span className="db-alert-icon">🔔</span>
              <div>
                <p className="db-alert-title">
                  {stats.pendingClaims} claim{stats.pendingClaims !== 1 ? "s" : ""} waiting for your review
                </p>
                <p className="db-alert-sub">
                  Approve or reject from My Uploads page
                </p>
              </div>
            </div>
            <button
              className="db-alert-btn"
              onClick={() => navigate("/my-documents?filter=PENDING_CLAIM")}
            >
              Review now →
            </button>
          </div>
        )}

        {/* ── Bottom Grid: Quick Links + Activity ── */}
        {!loading && (
          <div className="db-bottom-grid">

            {/* Quick Actions */}
            <div className="db-panel">
              <div className="db-panel-header">
                <span className="db-panel-title">Quick Actions</span>
                <div className="db-panel-line" />
              </div>
              <div className="db-quick-links">
                {quickLinks.map((link) => (
                  <button
                    key={link.path}
                    className="db-quick-btn"
                    onClick={() => navigate(link.path)}
                  >
                    <span className="db-quick-icon">{link.icon}</span>
                    <span className="db-quick-label">{link.label}</span>
                    <span className="db-quick-arrow">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="db-panel">
              <div className="db-panel-header">
                <span className="db-panel-title">Recent Activity</span>
                <div className="db-panel-line" />
              </div>
              <div className="db-activity-list">
                {stats?.totalUploads > 0 ? (
                  <>
                    <ActivityItem icon="📤" text="You uploaded a document" time="Recently" accent="#378ADD" />
                    {stats.pendingClaims > 0 && (
                      <ActivityItem icon="🔔" text="Claim request received" time="Awaiting" accent="#EF9F27" />
                    )}
                    {stats.claimedDocuments > 0 && (
                      <ActivityItem icon="✅" text="Document returned to owner" time="Done" accent="#1D9E75" />
                    )}
                    {stats.foundDocuments > 0 && (
                      <ActivityItem icon="📄" text="Documents available for claim" time="Active" accent="#639922" />
                    )}
                  </>
                ) : (
                  <p className="db-activity-empty">No activity yet. Upload your first found document!</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;