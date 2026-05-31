import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./SearchDocumentsPage.css";

const DOCUMENT_TYPES = [
  "Aadhar Card", "Marksheet", "ID Card",
  "Admit Card", "Certificate", "Other",
];

const STATUS_CONFIG = {
  FOUND:         { label: "Found",         color: "s-found",   icon: "◈" },
  PENDING_CLAIM: { label: "Claim Pending", color: "s-pending", icon: "◉" },
  CLAIMED:       { label: "Claimed",       color: "s-claimed", icon: "◆" },
};

/* ── Particle Canvas ─────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = 520;
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      dx: (Math.random() - 0.5) * 0.22,
      dy: (Math.random() - 0.5) * 0.22,
      o: Math.random() * 0.45 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,53,42,${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = 520;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="hero-particles" />;
}

/* ── Claim Modal ─────────────────────────────── */
function ClaimModal({ doc, onClose, onSuccess }) {
  const { user } = useAuth();
  const [form, setForm]     = useState({ name: user?.name || "", reason: "", contact: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [done, setDone]     = useState(false);
  const [revealedContact, setRevealedContact] = useState(null);
  const [step, setStep]     = useState(0);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.reason.trim()) {
      setError("Name and reason are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.patch(`/documents/${doc.id}/claim`, form);
      const updated = res.data.data;
      setRevealedContact(updated.finderContact);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Claim failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box claim-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <span>✕</span>
        </button>

        {!done ? (
          <>
            <div className="claim-modal-header">
              <div className="claim-doc-icon-wrap">
                <div className="claim-doc-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#e8352a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="#e8352a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8M16 17H8M10 9H8" stroke="#e8352a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="claim-doc-icon-ring" />
              </div>
              <div>
                <h3 className="claim-modal-title">Claim This Document</h3>
                <p className="claim-modal-sub">
                  <span className="claim-type-badge">{doc.documentType}</span>
                  <span className="claim-name">{doc.partialName}</span>
                </p>
              </div>
            </div>

            <div className="claim-info-banner">
              <div className="claim-info-icon">ℹ</div>
              <p className="claim-info-text">
                After submitting, the finder's contact will be revealed to you
                and your details will be shared with the finder.
              </p>
            </div>

            <div className="claim-form">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-dot" />
                  Your Full Name
                  <span className="label-req">*</span>
                </label>
                <input
                  className="form-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-dot" />
                  Why is this your document?
                  <span className="label-req">*</span>
                </label>
                <textarea
                  className="form-input form-textarea"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Describe identifying details — e.g. my roll number is 123, lost it near Central Park on 12 July..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-dot" />
                  Your Contact
                  <span className="label-opt">(optional)</span>
                </label>
                <input
                  className="form-input"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Phone or email"
                />
              </div>

              {error && (
                <div className="form-error-box">
                  <span className="error-icon">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                className="claim-submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
                  </span>
                ) : (
                  <>Submit Claim Request <span className="btn-arrow">→</span></>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="claim-success">
            <div className="success-aura" />
            <div className="success-circle">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="success-title">Claim Submitted!</h3>
            <p className="success-body">
              Your claim has been recorded. Contact the finder directly:
            </p>
            {revealedContact && (
              <div className="contact-reveal">
                <span className="contact-reveal-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{marginRight:6}}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.21 6.6a2 2 0 011.99-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 12a16 16 0 006.29 6.29l.62-.62a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Finder's Contact
                </span>
                <span className="contact-reveal-value">{revealedContact}</span>
              </div>
            )}
            <p className="success-note">
              The finder can also see your contact details and reason. Please
              reach out to coordinate the document handover.
            </p>
            <button className="claim-submit-btn success-done-btn" onClick={() => { onSuccess(); onClose(); }}>
              Done ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Document Card ───────────────────────────── */
function DocCard({ doc, onClaim, index }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const status   = STATUS_CONFIG[doc.status] || STATUS_CONFIG.FOUND;
  const cardRef  = useRef(null);

  const isOwner   = user && doc.uploadedBy === user._id;
  const canClaim  = user && !isOwner && doc.status === "FOUND";
  const isPending = doc.status === "PENDING_CLAIM";

  /* 3D tilt on hover */
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -7;
    const rotY = ((x - cx) / cx) * 7;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.015)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
  };

  return (
    <div
      className="search-card"
      ref={cardRef}
      style={{ animationDelay: `${index * 0.07}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sc-glow" />

      <div className="sc-image-wrap">
        {doc.imageUrl ? (
          <img src={doc.imageUrl} alt="Document" className="sc-image" />
        ) : (
          <div className="sc-placeholder">
            <div className="sc-placeholder-inner">
              <svg width="38" height="46" viewBox="0 0 38 46" fill="none">
                <rect x="1" y="1" width="36" height="44" rx="3" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                <rect x="7" y="14" width="24" height="2" rx="1" fill="rgba(255,255,255,0.12)"/>
                <rect x="7" y="20" width="18" height="2" rx="1" fill="rgba(255,255,255,0.12)"/>
                <rect x="7" y="26" width="21" height="2" rx="1" fill="rgba(255,255,255,0.12)"/>
                <path d="M24 2L36 12H27C25.3431 12 24 10.6569 24 9V2Z" fill="rgba(255,255,255,0.08)"/>
              </svg>
            </div>
            <div className="sc-placeholder-label">{doc.documentType}</div>
          </div>
        )}
        <div className="sc-image-overlay" />
        <span className={`sc-status ${status.color}`}>
          <span className="sc-status-dot" />{status.label}
        </span>
        <div className="sc-date-chip">
          {new Date(doc.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </div>
      </div>

      <div className="sc-body">
        <h3 className="sc-type">{doc.documentType}</h3>

        <div className="sc-metas">
          <div className="sc-meta-row">
            <span className="sc-meta-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="sc-meta-val">{doc.partialName}</span>
          </div>
          <div className="sc-meta-row">
            <span className="sc-meta-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
            </span>
            <span className="sc-meta-val">{doc.foundLocation}</span>
          </div>
        </div>

        {doc.finderContact && (
          <div className="sc-revealed-contact">
            <div className="sc-reveal-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{marginRight:5}}>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.21 6.6a2 2 0 011.99-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 12a16 16 0 006.29 6.29l.62-.62a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Finder's Contact
            </div>
            <span className="sc-reveal-val">{doc.finderContact}</span>
          </div>
        )}

        <div className="sc-actions">
          {canClaim && (
            <button className="sc-btn-claim" onClick={() => onClaim(doc)}>
              <span>This is Mine</span>
              <span className="btn-claim-arrow">→</span>
            </button>
          )}
          {isPending && !isOwner && (
            <div className="sc-status-pill sc-pending-note">
              <span className="pill-dot pending-dot" />
              Claim under review
            </div>
          )}
          {isOwner && (
            <button className="sc-btn-edit" onClick={() => navigate(`/documents/edit/${doc.id}`)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{marginRight:6}}>
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              My Upload
            </button>
          )}
          {doc.status === "CLAIMED" && (
            <div className="sc-status-pill sc-claimed-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{marginRight:5}}>
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Document Returned
            </div>
          )}
          {!user && doc.status === "FOUND" && (
            <button className="sc-btn-claim sc-btn-signin" onClick={() => navigate("/login")}>
              Sign in to Claim →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────── */
function SearchDocumentsPage() {
  const [documents, setDocuments]     = useState([]);
  const [loading, setLoading]         = useState(false);
  const [claimTarget, setClaimTarget] = useState(null);
  const [filters, setFilters]         = useState({ documentType: "", location: "", name: "" });
  const [searchDone, setSearchDone]   = useState(false);
  const heroRef = useRef(null);

  useEffect(() => { fetchDocuments(); }, []);

  /* Parallax hero on scroll */
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const y = window.scrollY;
      heroRef.current.style.transform = `translateY(${y * 0.28}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchDocuments = async (f = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/documents", { params: f });
      setDocuments(res.data.data);
      setSearchDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) =>
    setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSearch = (e) => { e.preventDefault(); fetchDocuments(filters); };

  const handleReset = () => {
    const empty = { documentType: "", location: "", name: "" };
    setFilters(empty);
    fetchDocuments(empty);
  };

  return (
    <div className="search-page">

      {/* ── Hero Section ── */}
      <section className="search-hero">
        <div className="hero-bg-layer" ref={heroRef}>
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>
        <ParticleCanvas />

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            India's #1 Lost Document Platform
          </div>

          <h1 className="hero-title">
            Find Your<br />
            <span className="hero-accent">Lost Document</span>
          </h1>

          <p className="hero-sub">
            Search among documents found across India.
            If yours is here — claim it, contact the finder, get it back.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-num">2,400+</span>
              <span className="stat-label">Docs Found</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="stat-num">1,800+</span>
              <span className="stat-label">Reunited</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">Cities</span>
            </div>
          </div>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-row">
              <div className="search-field-wrap">
                <span className="search-field-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  </svg>
                </span>
                <select
                  name="documentType"
                  className="search-select"
                  value={filters.documentType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Document Types</option>
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="search-field-wrap">
                <span className="search-field-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                    <circle cx="12" cy="10" r="3" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  </svg>
                </span>
                <input
                  type="text"
                  name="location"
                  className="search-input"
                  placeholder="Location — Delhi, Pune…"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="search-field-wrap">
                <span className="search-field-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  className="search-input"
                  placeholder="Name on document (partial)"
                  value={filters.name}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="search-btns">
              <button type="submit" className="btn-search" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
                  </span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight:8}}>
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Search Documents
                  </>
                )}
              </button>
              <button type="button" className="btn-reset" onClick={handleReset}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{marginRight:6}}>
                  <path d="M3 12a9 9 0 109-9H3M3 12l4-4M3 12l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          <span>scroll to results</span>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="results-section">
        {searchDone && (
          <div className="results-header">
            <div className="results-count-wrap">
              <div className="results-count-dot" />
              <p className="results-count">
                {loading
                  ? "Searching…"
                  : `${documents.length} document${documents.length !== 1 ? "s" : ""} found`}
              </p>
            </div>
            <div className="results-line" />
          </div>
        )}

        {loading ? (
          <div className="search-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img shimmer" />
                <div className="skeleton-body">
                  <div className="skeleton-line w-60 shimmer" />
                  <div className="skeleton-line w-80 shimmer" />
                  <div className="skeleton-line w-40 shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : documents.length === 0 && searchDone ? (
          <div className="no-results">
            <div className="no-results-gfx">
              <div className="no-results-ring" />
              <div className="no-results-ring no-results-ring-2" />
              <svg className="no-results-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="rgba(232,53,42,0.5)" strokeWidth="1.5"/>
                <path d="m21 21-4.35-4.35" stroke="rgba(232,53,42,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 11h6M11 8v6" stroke="rgba(232,53,42,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="no-results-title">No documents found</h3>
            <p className="no-results-body">Try different keywords or reset the filters.</p>
            <button className="no-results-btn" onClick={handleReset}>Clear Filters →</button>
          </div>
        ) : (
          <div className="search-grid">
            {documents.map((doc, i) => (
              <DocCard key={doc.id} doc={doc} onClaim={setClaimTarget} index={i} />
            ))}
          </div>
        )}
      </section>

      {claimTarget && (
        <ClaimModal
          doc={claimTarget}
          onClose={() => setClaimTarget(null)}
          onSuccess={() => fetchDocuments(filters)}
        />
      )}
    </div>
  );
}

export default SearchDocumentsPage;



