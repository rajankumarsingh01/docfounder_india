// import { useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import "./UploadDocumentPage.css";

// const DOCUMENT_TYPES = [
//   "Aadhar Card",
//   "Marksheet",
//   "ID Card",
//   "Admit Card",
//   "Certificate",
//   "Other",
// ];

// const DOC_ICONS = {
//   "Aadhar Card": "🪪",
//   "Marksheet": "📊",
//   "ID Card": "🪪",
//   "Admit Card": "📋",
//   "Certificate": "🏆",
//   "Other": "📄",
// };

// /* ─── Step Indicator ──────────────────────────────────────── */
// function StepDots({ current, total }) {
//   return (
//     <div className="up-steps">
//       {Array.from({ length: total }, (_, i) => (
//         <div
//           key={i}
//           className={`up-step-dot ${i < current ? "up-step-done" : ""} ${i === current - 1 ? "up-step-active" : ""}`}
//         />
//       ))}
//     </div>
//   );
// }

// /* ─── Image Drop Zone ─────────────────────────────────────── */
// function ImageDropZone({ image, preview, onFile, onClear }) {
//   const inputRef = useRef(null);
//   const [dragging, setDragging] = useState(false);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     setDragging(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file && file.type.startsWith("image/")) onFile(file);
//   }, [onFile]);

//   const handleDrag = (e) => {
//     e.preventDefault();
//     setDragging(e.type === "dragover");
//   };

//   return (
//     <div
//       className={`up-dropzone ${dragging ? "up-dropzone-drag" : ""} ${preview ? "up-dropzone-filled" : ""}`}
//       onDrop={handleDrop}
//       onDragOver={handleDrag}
//       onDragLeave={handleDrag}
//       onClick={() => !preview && inputRef.current?.click()}
//     >
//       <input
//         ref={inputRef}
//         type="file"
//         accept="image/*"
//         className="up-file-input"
//         onChange={(e) => {
//           const file = e.target.files?.[0];
//           if (file) onFile(file);
//         }}
//       />

//       {preview ? (
//         <div className="up-preview-wrap">
//           <img src={preview} alt="Document preview" className="up-preview-img" />
//           <div className="up-preview-overlay">
//             <button
//               className="up-preview-change"
//               onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
//             >
//               Change Image
//             </button>
//             <button
//               className="up-preview-clear"
//               onClick={(e) => { e.stopPropagation(); onClear(); }}
//             >
//               Remove
//             </button>
//           </div>
//           <div className="up-preview-badge">
//             <span>✓</span> Image ready
//           </div>
//         </div>
//       ) : (
//         <div className="up-dropzone-inner">
//           <div className="up-drop-icon-wrap">
//             <span className="up-drop-icon">📷</span>
//           </div>
//           <p className="up-drop-title">Drop document image here</p>
//           <p className="up-drop-sub">or click to browse · PNG, JPG, WEBP</p>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ─── Success Screen ──────────────────────────────────────── */
// function SuccessScreen({ onAgain, onDashboard }) {
//   return (
//     <div className="up-success">
//       <div className="up-success-orb" />
//       <div className="up-success-ring up-ring-1" />
//       <div className="up-success-ring up-ring-2" />
//       <div className="up-success-ring up-ring-3" />
//       <div className="up-success-icon">✓</div>
//       <h2 className="up-success-title">Document Uploaded!</h2>
//       <p className="up-success-sub">
//         Your found document is now live. The original owner can search and claim it.
//       </p>
//       <div className="up-success-btns">
//         <button className="up-btn-secondary" onClick={onAgain}>Upload Another</button>
//         <button className="up-btn-primary" onClick={onDashboard}>Go to Dashboard →</button>
//       </div>
//     </div>
//   );
// }

// /* ─── Main Page ───────────────────────────────────────────── */
// function UploadDocumentPage() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     documentType: "",
//     partialName: "",
//     foundLocation: "",
//     finderContact: "",
//   });
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   const filledCount =
//     [formData.documentType, formData.partialName, formData.foundLocation, formData.finderContact]
//       .filter(Boolean).length + (image ? 1 : 0);
//   const progress = Math.round((filledCount / 5) * 100);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//     if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
//   };

//   const handleBlur = (name) => {
//     setTouched((p) => ({ ...p, [name]: true }));
//     validate({ ...formData, _blur: name });
//   };

//   const validate = (data) => {
//     const errs = {};
//     if (!data.documentType) errs.documentType = "Please select a document type";
//     if (!data.partialName?.trim()) errs.partialName = "Partial name is required";
//     if (!data.foundLocation?.trim()) errs.foundLocation = "Found location is required";
//     if (!data.finderContact?.trim()) errs.finderContact = "Your contact info is required";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleFileSelect = (file) => {
//     setImage(file);
//     const reader = new FileReader();
//     reader.onload = (e) => setPreview(e.target.result);
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setTouched({ documentType: true, partialName: true, foundLocation: true, finderContact: true });
//     if (!validate(formData)) return;

//     try {
//       setLoading(true);
//       const data = new FormData();
//       data.append("documentType", formData.documentType);
//       data.append("partialName", formData.partialName);
//       data.append("foundLocation", formData.foundLocation);
//       data.append("finderContact", formData.finderContact);
//       if (image) data.append("image", image);

//       await api.post("/documents", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setSuccess(true);
//     } catch (err) {
//       const msg = err.response?.data?.message || "Upload failed. Please try again.";
//       setErrors({ submit: msg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({ documentType: "", partialName: "", foundLocation: "", finderContact: "" });
//     setImage(null);
//     setPreview(null);
//     setErrors({});
//     setTouched({});
//     setSuccess(false);
//   };

//   if (success) {
//     return (
//       <div className="up-root">
//         <div className="up-bg-glow up-glow-1" />
//         <div className="up-bg-glow up-glow-2" />
//         <div className="up-bg-grid" />
//         <div className="up-container">
//           <SuccessScreen onAgain={handleReset} onDashboard={() => navigate("/dashboard")} />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="up-root">
//       <div className="up-bg-glow up-glow-1" />
//       <div className="up-bg-glow up-glow-2" />
//       <div className="up-bg-grid" />

//       <div className="up-container">




//         {/* ── Header ── */}
//         <div className="up-header">
//           <button className="up-back-btn" onClick={() => navigate(-1)}>← Back</button>
//           <div className="up-header-center">
//             <div className="up-eyebrow">
//               <span className="up-eyebrow-dot" />
//               Found something?
//             </div>
//             <h1 className="up-title">Upload Document</h1>
//             <p className="up-subtitle">Help someone recover their lost document</p>
//           </div>
//         </div>

//         {/* ── Progress Bar ── */}
//         <div className="up-progress-wrap">
//           <div className="up-progress-track">
//             <div className="up-progress-fill" style={{ width: `${progress}%` }} />
//           </div>
//           <span className="up-progress-label">{progress}% complete</span>
//         </div>

//         {/* ── Form Card ── */}
//         <form className="up-form" onSubmit={handleSubmit} noValidate>

//           <div className="up-form-grid">

//             {/* LEFT: Form Fields */}
//             <div className="up-fields">

//               {/* Document Type */}
//               <div className={`up-field-group ${touched.documentType && errors.documentType ? "up-field-error" : ""} ${formData.documentType ? "up-field-filled" : ""}`}>
//                 <label className="up-label">
//                   Document Type
//                   <span className="up-required">*</span>
//                 </label>
//                 <div className="up-select-wrap">
//                   <select
//                     name="documentType"
//                     value={formData.documentType}
//                     onChange={handleChange}
//                     onBlur={() => handleBlur("documentType")}
//                     className="up-select"
//                   >
//                     <option value="">Select document type…</option>
//                     {DOCUMENT_TYPES.map((t) => (
//                       <option key={t} value={t}>{DOC_ICONS[t]} {t}</option>
//                     ))}
//                   </select>
//                   <span className="up-select-arrow">▾</span>
//                 </div>
//                 {touched.documentType && errors.documentType && (
//                   <span className="up-error-msg">{errors.documentType}</span>
//                 )}
//               </div>

//               {/* Partial Name */}
//               <div className={`up-field-group ${touched.partialName && errors.partialName ? "up-field-error" : ""} ${formData.partialName ? "up-field-filled" : ""}`}>
//                 <label className="up-label">
//                   Partial Name
//                   <span className="up-required">*</span>
//                   <span className="up-label-hint">e.g. Raj***, A*** K***</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="partialName"
//                   value={formData.partialName}
//                   onChange={handleChange}
//                   onBlur={() => handleBlur("partialName")}
//                   className="up-input"
//                   placeholder="Visible name on the document"
//                   autoComplete="off"
//                 />
//                 {touched.partialName && errors.partialName && (
//                   <span className="up-error-msg">{errors.partialName}</span>
//                 )}
//               </div>

//               {/* Found Location */}
//               <div className={`up-field-group ${touched.foundLocation && errors.foundLocation ? "up-field-error" : ""} ${formData.foundLocation ? "up-field-filled" : ""}`}>
//                 <label className="up-label">
//                   Found Location
//                   <span className="up-required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="foundLocation"
//                   value={formData.foundLocation}
//                   onChange={handleChange}
//                   onBlur={() => handleBlur("foundLocation")}
//                   className="up-input"
//                   placeholder="e.g. Patna Station, Gate 2"
//                   autoComplete="off"
//                 />
//                 {touched.foundLocation && errors.foundLocation && (
//                   <span className="up-error-msg">{errors.foundLocation}</span>
//                 )}
//               </div>

//               {/* Finder Contact */}
//               <div className={`up-field-group ${touched.finderContact && errors.finderContact ? "up-field-error" : ""} ${formData.finderContact ? "up-field-filled" : ""}`}>
//                 <label className="up-label">
//                   Your Contact
//                   <span className="up-required">*</span>
//                   <span className="up-label-hint">Hidden from public · revealed to verified owner</span>
//                 </label>
//                 <div className="up-input-wrap">
//                   <span className="up-input-icon">🔒</span>
//                   <input
//                     type="text"
//                     name="finderContact"
//                     value={formData.finderContact}
//                     onChange={handleChange}
//                     onBlur={() => handleBlur("finderContact")}
//                     className="up-input up-input-padded"
//                     placeholder="Phone or email"
//                     autoComplete="off"
//                   />
//                 </div>
//                 {touched.finderContact && errors.finderContact && (
//                   <span className="up-error-msg">{errors.finderContact}</span>
//                 )}
//               </div>

//             </div>

//             {/* RIGHT: Image Upload */}
//             <div className="up-image-col">
//               <label className="up-label up-img-label">Document Image</label>
//               <p className="up-img-hint">Optional but helps with verification</p>
//               <ImageDropZone
//                 image={image}
//                 preview={preview}
//                 onFile={handleFileSelect}
//                 onClear={() => { setImage(null); setPreview(null); }}
//               />

//               {/* Info card */}
//               <div className="up-info-card">
//                 <div className="up-info-row">
//                   <span>🛡️</span>
//                   <span>Your contact stays <strong>private</strong> until owner verifies</span>
//                 </div>
//                 <div className="up-info-row">
//                   <span>🔍</span>
//                   <span>Document is <strong>searchable</strong> instantly after upload</span>
//                 </div>
//                 <div className="up-info-row">
//                   <span>✅</span>
//                   <span>You control <strong>approval</strong> of claims</span>
//                 </div>
//               </div>
//             </div>

//           </div>

//           {/* Submit error */}
//           {errors.submit && (
//             <div className="up-submit-error">
//               <span>⚠️</span> {errors.submit}
//             </div>
//           )}

//           {/* CTA */}
//           <div className="up-form-footer">
//             <StepDots current={Math.min(Math.ceil(filledCount / 1.25), 4)} total={4} />
//             <button
//               type="submit"
//               className={`up-submit-btn ${loading ? "up-btn-loading" : ""}`}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="up-spinner" />
//                   Uploading…
//                 </>
//               ) : (
//                 <>
//                   <span>Upload Document</span>
//                   <span className="up-submit-arrow">→</span>
//                 </>
//               )}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }

// export default UploadDocumentPage;






import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import "./UploadDocumentPage.css";

const DOCUMENT_TYPES = [
  "Aadhar Card",
  "Marksheet",
  "ID Card",
  "Admit Card",
  "Certificate",
  "Other",
];

const DOC_ICONS = {
  "Aadhar Card": "🪪",
  "Marksheet": "📊",
  "ID Card": "🪪",
  "Admit Card": "📋",
  "Certificate": "🏆",
  "Other": "📄",
};

/* ─── Step Indicator ──────────────────────────────────────── */
function StepDots({ current, total }) {
  return (
    <div className="up-steps">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`up-step-dot ${i < current ? "up-step-done" : ""} ${
            i === current - 1 ? "up-step-active" : ""
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Image Drop Zone ─────────────────────────────────────── */
function ImageDropZone({ image, preview, onFile, onClear }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) onFile(file);
    },
    [onFile]
  );

  const handleDrag = (e) => {
    e.preventDefault();
    setDragging(e.type === "dragover");
  };

  return (
    <div
      className={`up-dropzone ${dragging ? "up-dropzone-drag" : ""} ${
        preview ? "up-dropzone-filled" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onClick={() => !preview && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="up-file-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />

      {preview ? (
        <div className="up-preview-wrap">
          <img src={preview} alt="Document preview" className="up-preview-img" />
          <div className="up-preview-overlay">
            <button
              className="up-preview-change"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Change Image
            </button>
            <button
              className="up-preview-clear"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            >
              Remove
            </button>
          </div>
          <div className="up-preview-badge">
            <span>✓</span> Image ready
          </div>
        </div>
      ) : (
        <div className="up-dropzone-inner">
          <div className="up-drop-icon-wrap">
            <span className="up-drop-icon">📷</span>
          </div>
          <p className="up-drop-title">Drop document image here</p>
          <p className="up-drop-sub">or click to browse · PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
}

/* ─── Success Screen ──────────────────────────────────────── */
function SuccessScreen({ onAgain, onDashboard }) {
  return (
    <div className="up-success">
      <div className="up-success-orb" />
      <div className="up-success-ring up-ring-1" />
      <div className="up-success-ring up-ring-2" />
      <div className="up-success-ring up-ring-3" />
      <div className="up-success-icon">✓</div>
      <h2 className="up-success-title">Document Uploaded!</h2>
      <p className="up-success-sub">
        Your found document is now live. The original owner can search and claim it.
      </p>
      <div className="up-success-btns">
        <button className="up-btn-secondary" onClick={onAgain}>
          Upload Another
        </button>
        <button className="up-btn-primary" onClick={onDashboard}>
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
function UploadDocumentPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    documentType: "",
    partialName: "",
    foundLocation: "",
    finderContact: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const filledCount =
    [formData.documentType, formData.partialName, formData.foundLocation, formData.finderContact]
      .filter(Boolean).length + (image ? 1 : 0);

  const progress = Math.round((filledCount / 5) * 100);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleBlur = (name) => {
    setTouched((p) => ({ ...p, [name]: true }));
    validate({ ...formData, _blur: name });
  };

  const validate = (data) => {
    const errs = {};
    if (!data.documentType) errs.documentType = "Please select a document type";
    if (!data.partialName?.trim()) errs.partialName = "Partial name is required";
    if (!data.foundLocation?.trim()) errs.foundLocation = "Found location is required";
    if (!data.finderContact?.trim()) errs.finderContact = "Your contact info is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileSelect = (file) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate(formData)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const loadingToast = toast.loading("Uploading document...");

      const data = new FormData();
      data.append("documentType", formData.documentType);
      data.append("partialName", formData.partialName);
      data.append("foundLocation", formData.foundLocation);
      data.append("finderContact", formData.finderContact);
      if (image) data.append("image", image);

      await api.post("/documents", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Document uploaded successfully!", {
        id: loadingToast,
      });

      setSuccess(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      documentType: "",
      partialName: "",
      foundLocation: "",
      finderContact: "",
    });
    setImage(null);
    setPreview(null);
    setErrors({});
    setTouched({});
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="up-root">
        <div className="up-bg-glow up-glow-1" />
        <div className="up-bg-glow up-glow-2" />
        <div className="up-bg-grid" />
        <div className="up-container">
          <SuccessScreen
            onAgain={handleReset}
            onDashboard={() => navigate("/dashboard")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="up-root">
      <div className="up-bg-glow up-glow-1" />
      <div className="up-bg-glow up-glow-2" />
      <div className="up-bg-grid" />

      <div className="up-container">
        {/* Header */}
        <div className="up-header">
          <button className="up-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="up-header-center">
            <div className="up-eyebrow">
              <span className="up-eyebrow-dot" />
              Found something?
            </div>

            <h1 className="up-title">Upload Document</h1>
            <p className="up-subtitle">
              Help someone recover their lost document
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="up-progress-wrap">
          <div className="up-progress-track">
            <div className="up-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="up-progress-label">{progress}% complete</span>
        </div>

        {/* FORM (UNCHANGED UI) */}
        <form className="up-form" onSubmit={handleSubmit} noValidate>
          <div className="up-form-grid">
            <div className="up-fields">

              {/* Document Type */}
              <div className="up-field-group">
                <label className="up-label">Document Type *</label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="up-select"
                >
                  <option value="">Select document type…</option>
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {DOC_ICONS[t]} {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Partial Name */}
              <div className="up-field-group">
                <label className="up-label">Partial Name *</label>
                <input
                  type="text"
                  name="partialName"
                  value={formData.partialName}
                  onChange={handleChange}
                  className="up-input"
                  placeholder="Raj***"
                />
              </div>

              {/* Found Location */}
              <div className="up-field-group">
                <label className="up-label">Found Location *</label>
                <input
                  type="text"
                  name="foundLocation"
                  value={formData.foundLocation}
                  onChange={handleChange}
                  className="up-input"
                  placeholder="Patna Station"
                />
              </div>

              {/* Finder Contact */}
              <div className="up-field-group">
                <label className="up-label">Your Contact *</label>
                <input
                  type="text"
                  name="finderContact"
                  value={formData.finderContact}
                  onChange={handleChange}
                  className="up-input"
                  placeholder="Phone or email"
                />
              </div>

            </div>

            {/* IMAGE */}
            <div className="up-image-col">
              <label className="up-label">Document Image</label>
              <ImageDropZone
                image={image}
                preview={preview}
                onFile={handleFileSelect}
                onClear={() => {
                  setImage(null);
                  setPreview(null);
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="up-form-footer">
            <StepDots current={Math.min(Math.ceil(filledCount / 1.25), 4)} total={4} />

            <button
              type="submit"
              className="up-submit-btn"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Document →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadDocumentPage;