import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./EditDocumentPage.css";

const DOCUMENT_TYPES = [
  "Aadhar Card", "Marksheet", "ID Card",
  "Admit Card", "Certificate", "Other",
];

function EditDocumentPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [form, setForm]       = useState({
    documentType: "", partialName: "", foundLocation: "", finderContact: "",
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const res = await api.get(`/documents/${id}`);
      const doc = res.data.data;
      setForm({
        documentType:  doc.documentType  || "",
        partialName:   doc.partialName   || "",
        foundLocation: doc.foundLocation || "",
        finderContact: doc.finderContact || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load document.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.documentType || !form.partialName || !form.foundLocation || !form.finderContact) {
      setError("All fields are required.");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/documents/${id}`, form);
      setSuccess(true);
      setTimeout(() => navigate("/my-documents"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-page">
        <div className="edit-card">
          <div className="edit-skeleton">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-field shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="edit-page">
        <div className="edit-card success-card">
          <div className="success-anim">✓</div>
          <h2 className="success-h">Document Updated!</h2>
          <p className="success-p">Redirecting to your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-page">
      <div className="edit-card">
        {/* Header */}
        <div className="edit-header">
          <button className="back-btn" onClick={() => navigate("/my-documents")}>
            ← Back
          </button>
          <div>
            <h1 className="edit-title">Edit Document</h1>
            <p className="edit-sub">Update the details of your uploaded document</p>
          </div>
        </div>

        {error && (
          <div className="edit-error">
            <span>⚠</span> {error}
          </div>
        )}

        <form className="edit-form" onSubmit={handleSubmit}>
          {/* Document Type */}
          <div className="field-group">
            <label className="field-label">Document Type *</label>
            <select
              name="documentType"
              className="field-input"
              value={form.documentType}
              onChange={handleChange}
              required
            >
              <option value="">Select document type</option>
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Partial Name */}
          <div className="field-group">
            <label className="field-label">Partial Name on Document *</label>
            <input
              type="text"
              name="partialName"
              className="field-input"
              value={form.partialName}
              onChange={handleChange}
              placeholder="e.g. Raj***, Priy***"
              required
            />
            <p className="field-hint">
              Mask last characters for privacy (e.g. Raj***)
            </p>
          </div>

          {/* Found Location */}
          <div className="field-group">
            <label className="field-label">Found Location *</label>
            <input
              type="text"
              name="foundLocation"
              className="field-input"
              value={form.foundLocation}
              onChange={handleChange}
              placeholder="e.g. Central Park, New Delhi"
              required
            />
          </div>

          {/* Finder Contact */}
          <div className="field-group">
            <label className="field-label">Your Contact *</label>
            <input
              type="text"
              name="finderContact"
              className="field-input"
              value={form.finderContact}
              onChange={handleChange}
              placeholder="Phone or email — shared only after claim"
              required
            />
            <p className="field-hint">
              This will only be revealed to the verified document owner
            </p>
          </div>

          {/* Actions */}
          <div className="edit-actions">
            <button
              type="button"
              className="edit-btn-cancel"
              onClick={() => navigate("/my-documents")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edit-btn-save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDocumentPage;