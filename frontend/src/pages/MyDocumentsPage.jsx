import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./MyDocumentsPage.css";

const STATUS_CONFIG = {
  FOUND:         { label: "Found",         color: "status-found" },
  PENDING_CLAIM: { label: "Claim Pending", color: "status-pending" },
  CLAIMED:       { label: "Claimed",       color: "status-claimed" },
  ARCHIVED:      { label: "Archived",      color: "status-archived" },
};

/* ─── Delete Confirm Modal ─────────────────────────────────────── */
function ConfirmModal({ doc, onConfirm, onCancel, deleting }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">🗑</div>
        <h3 className="modal-title">Delete Document?</h3>
        <p className="modal-body">
          <strong>{doc.documentType}</strong> — {doc.partialName} will be
          permanently removed. This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button className="modal-btn confirm" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Claim Banner with Approve / Reject ───────────────────────── */
function ClaimBanner({ doc, onAction }) {
  const [loading, setLoading] = useState(null); // "approve" | "reject" | null

  if (doc.status !== "PENDING_CLAIM" || !doc.claimInfo) return null;

  const handle = async (action) => {
    setLoading(action);
    try {
      await api.patch(`/documents/${doc.id}/${action}-claim`);
      onAction(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="claim-banner">
      <div className="claim-header">
        <span className="claim-pulse" />
        <span className="claim-title">Claim request received</span>
      </div>

      <p className="claim-meta">
        <strong>{doc.claimInfo.claimerName}</strong>
        {doc.claimInfo.claimerReason && (
          <> — &ldquo;{doc.claimInfo.claimerReason}&rdquo;</>
        )}
      </p>

      {doc.claimInfo.claimerContact && (
        <p className="claim-contact">📞 {doc.claimInfo.claimerContact}</p>
      )}

      {doc.claimInfo.claimRequestedAt && (
        <p className="claim-time">
          {new Date(doc.claimInfo.claimRequestedAt).toLocaleString("en-IN")}
        </p>
      )}

      <div className="claim-actions">
        <button
          className="btn-approve"
          onClick={() => handle("approve")}
          disabled={!!loading}
        >
          {loading === "approve" ? "Approving…" : "✓ Approve"}
        </button>
        <button
          className="btn-reject"
          onClick={() => handle("reject")}
          disabled={!!loading}
        >
          {loading === "reject" ? "Rejecting…" : "✗ Reject"}
        </button>
      </div>
    </div>
  );
}

/* ─── Single Document Card ─────────────────────────────────────── */
function DocumentCard({ doc, onEdit, onDelete, onRefresh }) {
  const status = STATUS_CONFIG[doc.status] || STATUS_CONFIG.FOUND;
  const isPending = doc.status === "PENDING_CLAIM";
  const isClaimed = doc.status === "CLAIMED";

  return (
    <div className={`doc-card ${isPending ? "card-highlight" : ""}`}>
      {/* Image / placeholder */}
      <div className="card-image-wrap">
        {doc.imageUrl ? (
          <img src={doc.imageUrl} alt="Document" className="card-image" />
        ) : (
          <div className="card-image-placeholder">
            <span className="placeholder-icon">📄</span>
          </div>
        )}
        <span className={`status-badge ${status.color}`}>{status.label}</span>
      </div>

      {/* Body */}
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-type">{doc.documentType}</h3>
          <span className="card-date">
            {new Date(doc.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>

        <div className="card-meta">
          <div className="meta-row">
            <span className="meta-label">Name</span>
            <span className="meta-value">{doc.partialName}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Location</span>
            <span className="meta-value">{doc.foundLocation}</span>
          </div>
          {doc.finderContact && (
            <div className="meta-row">
              <span className="meta-label">Your contact</span>
              <span className="meta-value contact-value">{doc.finderContact}</span>
            </div>
          )}
          {isClaimed && doc.claimInfo?.claimerName && (
            <div className="meta-row">
              <span className="meta-label">Claimed by</span>
              <span className="meta-value" style={{ color: "var(--color-text-success)" }}>
                {doc.claimInfo.claimerName}
              </span>
            </div>
          )}
        </div>

        {/* Claim action banner — only for PENDING_CLAIM */}
        <ClaimBanner doc={doc} onAction={onRefresh} />

        {/* Edit / Delete */}
        <div className="card-actions">
          <button
            className="action-btn edit"
            onClick={() => onEdit(doc.id)}
            disabled={isClaimed}
            style={isClaimed ? { opacity: 0.4, cursor: "not-allowed" } : {}}
          >
            ✎ Edit
          </button>
          <button className="action-btn delete" onClick={() => onDelete(doc)}>
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */
function MyDocumentsPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]   = useState(false);
  const [filter, setFilter]       = useState("ALL");

  useEffect(() => { fetchDocuments(); }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/documents/my");
      setDocuments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/documents/${deleteTarget.id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filtered =
    filter === "ALL"
      ? documents
      : documents.filter((d) => d.status === filter);

  /* Skeleton */
  if (loading) {
    return (
      <div className="my-docs-page">
        <div className="loading-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img shimmer" />
              <div className="skeleton-body">
                <div className="skeleton-line w-60 shimmer" />
                <div className="skeleton-line w-40 shimmer" />
                <div className="skeleton-line w-80 shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-docs-page">
      {/* Header */}
      <div className="page-header">
        
<button
  onClick={() => navigate("/")}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: "13px",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    transition: "0.2s ease",
    marginBottom: "10px",
  }}
  onMouseOver={(e) =>
    (e.currentTarget.style.transform = "translateX(-2px)")
  }
  onMouseOut={(e) =>
    (e.currentTarget.style.transform = "translateX(0px)")
  }
>
  ← Back
</button>


        <div>
          <h1 className="page-title">My Uploads</h1>
          <p className="page-subtitle">
            {documents.length} document{documents.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>
        <button className="btn-new" onClick={() => navigate("/upload")}>
          + Upload New
        </button>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {["ALL", "FOUND", "PENDING_CLAIM", "CLAIMED"].map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? "active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab === "ALL" ? "All" : STATUS_CONFIG[tab]?.label}
            <span className="tab-count">
              {tab === "ALL"
                ? documents.length
                : documents.filter((d) => d.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3 className="empty-title">No documents here</h3>
          <p className="empty-body">
            {filter === "ALL"
              ? "You haven't uploaded any found documents yet."
              : `No documents with status "${STATUS_CONFIG[filter]?.label}".`}
          </p>
          {filter === "ALL" && (
            <button className="btn-new" onClick={() => navigate("/upload")}>
              Upload Your First Document
            </button>
          )}
        </div>
      ) : (
        <div className="docs-grid">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onEdit={(id) => navigate(`/documents/edit/${id}`)}
              onDelete={(doc) => setDeleteTarget(doc)}
              onRefresh={fetchDocuments}
            />
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <ConfirmModal
          doc={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}

export default MyDocumentsPage;