// import { useState, useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import "./Auth.css";
// import toast from "react-hot-toast";

// /* ── Password strength util ── */
// function getStrength(pw) {
//   if (!pw) return { score: 0, label: "", bars: 0 };
//   let score = 0;
//   if (pw.length >= 6)  score++;
//   if (pw.length >= 10) score++;
//   if (/[A-Z]/.test(pw)) score++;
//   if (/[0-9]/.test(pw)) score++;
//   if (/[^A-Za-z0-9]/.test(pw)) score++;

//   if (score <= 2) return { score, label: "Weak",   bars: 1, cls: "active-weak" };
//   if (score <= 3) return { score, label: "Fair",   bars: 2, cls: "active-medium" };
//   return              { score, label: "Strong", bars: 3, cls: "active-strong" };
// }

// /* ── Brand left panel — register variant ── */
// function BrandPanel() {
//   return (
//     <div className="auth-brand-panel">
//       <div>
//         <div className="brand-logo">
//           <div className="brand-logo-mark">D</div>
//           <span className="brand-logo-name">DocFinder</span>
//         </div>

//         <p className="brand-tagline">
//           Help someone find<br />
//           what they <span>lost.</span>
//         </p>
//         <p className="brand-desc">
//           Join thousands of Good Samaritans who upload
//           found documents and reunite them with their owners.
//         </p>
//       </div>

//       {/* 3D floating document stack */}
//       <div className="brand-doc-card" aria-hidden="true">
//         <div className="brand-doc-inner">
//           <div className="doc-face">
//             <div className="doc-face-avatar" />
//             <div className="doc-face-line w-full" />
//             <div className="doc-face-line w-3q" />
//             <div className="doc-face-line w-half" />
//             <div className="doc-face-line w-2q" />
//             <div className="doc-face-line w-full" />
//           </div>
//         </div>
//       </div>

//       <div className="brand-stats">
//         <div className="brand-stat">
//           <span className="brand-stat-num">12k+</span>
//           <span className="brand-stat-label">Users</span>
//         </div>
//         <div className="brand-stat">
//           <span className="brand-stat-num">Free</span>
//           <span className="brand-stat-label">Always</span>
//         </div>
//         <div className="brand-stat">
//           <span className="brand-stat-num">🇮🇳</span>
//           <span className="brand-stat-label">Made in India</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function RegisterPage() {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();

//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//   const [loading, setLoading]   = useState(false);
//   const [error, setError]       = useState("");
//   const [showPw, setShowPw]     = useState(false);

//   const strength = useMemo(
//     () => getStrength(formData.password),
//     [formData.password]
//   );

//   const handleChange = (e) => {
//     setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name.trim())  { setError("Please enter your full name.");
//        toast.error("Full name is required");
//         return; }
//     if (!formData.email)        { setError("Please enter your email.");
//        toast.error("Email is required");
//         return; }
//     if (!formData.password)     { setError("Please enter a password.");
//        toast.error("Password is required");
//         return; }
//     if (formData.password.length < 6) { setError("Password must be at least 6 characters.");
//        toast.error("Password is too short");
//         return; }

//     setLoading(true);
//     try {
//       const res = await api.post("/auth/register", formData);
//       const { token, user } = res.data.data;
//       localStorage.setItem("token", token);
//       setUser(user);
//       toast.success("Registration successful!");
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed. Try again.");
//       toast.error("Registration failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-shell">
//       <div className="auth-orb auth-orb-1" aria-hidden="true" />
//       <div className="auth-orb auth-orb-2" aria-hidden="true" />

//       <div className="auth-layout">
//         {/* Left — Brand */}
//         <BrandPanel />

//         {/* Right — Form */}
//         <div className="auth-form-panel">

//           {/* Mobile mini header */}
//           <div className="auth-mobile-top">
//             <div className="brand-logo-mark">D</div>
//             <span className="brand-logo-name">DocFinder</span>
//           </div>

//           <h1 className="auth-form-title">Create account</h1>
//           <p className="auth-form-sub">
//             Already have one?{" "}
//             <Link to="/login">Sign in instead</Link>
//           </p>

//           {error && (
//             <div className="auth-error" role="alert">
//               <span>⚠</span> {error}
//             </div>
//           )}

//           <form className="auth-form" onSubmit={handleSubmit} noValidate>

//             {/* Full name */}
//             <div className="field-wrap">
//               <label className="field-label-float" htmlFor="reg-name">
//                 Full name
//               </label>
//               <div className="field-input-wrap">
//                 <span className="field-icon">👤</span>
//                 <input
//                   id="reg-name"
//                   type="text"
//                   name="name"
//                   className="auth-input"
//                   placeholder="Rahul Sharma"
//                   value={formData.name}
//                   onChange={handleChange}
//                   autoComplete="name"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div className="field-wrap">
//               <label className="field-label-float" htmlFor="reg-email">
//                 Email address
//               </label>
//               <div className="field-input-wrap">
//                 <span className="field-icon">✉</span>
//                 <input
//                   id="reg-email"
//                   type="email"
//                   name="email"
//                   className="auth-input"
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   autoComplete="email"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password + strength */}
//             <div className="field-wrap">
//               <label className="field-label-float" htmlFor="reg-pw">
//                 Password
//               </label>
//               <div className="field-input-wrap">
//                 <span className="field-icon">🔒</span>
//                 <input
//                   id="reg-pw"
//                   type={showPw ? "text" : "password"}
//                   name="password"
//                   className="auth-input"
//                   placeholder="Min. 6 characters"
//                   value={formData.password}
//                   onChange={handleChange}
//                   autoComplete="new-password"
//                   required
//                   style={{ paddingRight: "46px" }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPw((p) => !p)}
//                   style={{
//                     position: "absolute", right: "14px",
//                     background: "none", border: "none",
//                     color: "var(--t3)", cursor: "pointer",
//                     fontSize: "15px", padding: "0", lineHeight: 1,
//                   }}
//                   aria-label={showPw ? "Hide password" : "Show password"}
//                 >
//                   {showPw ? "🙈" : "👁"}
//                 </button>
//               </div>

//               {/* Password strength bars */}
//               {formData.password && (
//                 <div className="pw-strength">
//                   {[1, 2, 3].map((n) => (
//                     <div
//                       key={n}
//                       className={`pw-bar ${n <= strength.bars ? strength.cls : ""}`}
//                     />
//                   ))}
//                   <span className="pw-label">{strength.label}</span>
//                 </div>
//               )}
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="auth-submit"
//               disabled={loading}
//             >
//               {loading && <span className="btn-spinner" />}
//               {loading ? "Creating account..." : "Create Account →"}
//             </button>

//             <p style={{
//               fontSize: "11.5px",
//               color: "var(--t3)",
//               textAlign: "center",
//               lineHeight: 1.6,
//               marginTop: "4px",
//             }}>
//               By registering, you agree to help return
//               lost documents to their rightful owners.
//             </p>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RegisterPage;


import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Auth.css";

/* ── Password strength util ── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", bars: 0 };

  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2)
    return { score, label: "Weak", bars: 1, cls: "active-weak" };
  if (score <= 3)
    return { score, label: "Fair", bars: 2, cls: "active-medium" };

  return { score, label: "Strong", bars: 3, cls: "active-strong" };
}

/* ── Brand panel ── */
function BrandPanel() {
  return (
    <div className="auth-brand-panel">
      <div>
        <div className="brand-logo">
          <div className="brand-logo-mark">D</div>
          <span className="brand-logo-name">DocFinder</span>
        </div>

        <p className="brand-tagline">
          Help someone find<br />
          what they <span>lost.</span>
        </p>

        <p className="brand-desc">
          Join thousands of Good Samaritans who upload found documents and
          reunite them with their owners.
        </p>
      </div>

      <div className="brand-doc-card" aria-hidden="true">
        <div className="brand-doc-inner">
          <div className="doc-face">
            <div className="doc-face-avatar" />
            <div className="doc-face-line w-full" />
            <div className="doc-face-line w-3q" />
            <div className="doc-face-line w-half" />
            <div className="doc-face-line w-2q" />
            <div className="doc-face-line w-full" />
          </div>
        </div>
      </div>

      <div className="brand-stats">
        <div className="brand-stat">
          <span className="brand-stat-num">12k+</span>
          <span className="brand-stat-label">Users</span>
        </div>
        <div className="brand-stat">
          <span className="brand-stat-num">Free</span>
          <span className="brand-stat-label">Always</span>
        </div>
        <div className="brand-stat">
          <span className="brand-stat-num">🇮🇳</span>
          <span className="brand-stat-label">Made in India</span>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const strength = useMemo(
    () => getStrength(formData.password),
    [formData.password]
  );

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter a password");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Creating your account...");

    try {
      const res = await api.post("/auth/register", formData);

      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      setUser(user);

      toast.success("Account created successfully!", {
        id: loadingToast,
      });

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed",
        {
          id: loadingToast,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-layout">
        {/* Left panel */}
        <BrandPanel />

        {/* Right form */}
        <div className="auth-form-panel">
          <div className="auth-mobile-top">
            <div className="brand-logo-mark">D</div>
            <span className="brand-logo-name">DocFinder</span>
          </div>

          <h1 className="auth-form-title">Create account</h1>

          <p className="auth-form-sub">
            Already have one? <Link to="/login">Sign in instead</Link>
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="field-wrap">
              <label className="field-label-float">Full name</label>
              <div className="field-input-wrap">
                <span className="field-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  className="auth-input"
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="field-wrap">
              <label className="field-label-float">Email</label>
              <div className="field-input-wrap">
                <span className="field-icon">✉</span>
                <input
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-wrap">
              <label className="field-label-float">Password</label>
              <div className="field-input-wrap">
                <span className="field-icon">🔒</span>

                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  className="auth-input"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingRight: "46px" }}
                />

                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>

              {formData.password && (
                <div className="pw-strength">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className={`pw-bar ${
                        n <= strength.bars ? strength.cls : ""
                      }`}
                    />
                  ))}
                  <span className="pw-label">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button className="auth-submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account →"}
            </button>

            <p
              style={{
                fontSize: "11.5px",
                textAlign: "center",
                marginTop: "6px",
                color: "var(--t3)",
              }}
            >
              By registering, you agree to help return lost documents.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;