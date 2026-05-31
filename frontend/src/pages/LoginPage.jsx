// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import "./Auth.css";

// /* ── Brand left panel ── */
// function BrandPanel() {
//   return (
//     <div className="auth-brand-panel">
//       <div>
//         <div className="brand-logo">
//           <div className="brand-logo-mark">D</div>
//           <span className="brand-logo-name">DocFinder</span>
//         </div>

//         <p className="brand-tagline">
//           Lost documents,<br />
//           <span>Found again.</span>
//         </p>
//         <p className="brand-desc">
//           India's first platform where finders upload
//           and owners reclaim — safely, instantly.
//         </p>
//       </div>

//       {/* 3D floating document */}
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
//           <span className="brand-stat-num">2.4k+</span>
//           <span className="brand-stat-label">Docs Found</span>
//         </div>
//         <div className="brand-stat">
//           <span className="brand-stat-num">98%</span>
//           <span className="brand-stat-label">Return Rate</span>
//         </div>
//         <div className="brand-stat">
//           <span className="brand-stat-num">48h</span>
//           <span className="brand-stat-label">Avg. Return</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function LoginPage() {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading]   = useState(false);
//   const [error, setError]       = useState("");
//   const [showPw, setShowPw]     = useState(false);

//   const handleChange = (e) => {
//     setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.post("/auth/login", formData);
//       const { token, user } = res.data.data;
//       localStorage.setItem("token", token);
//       setUser(user);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-shell">
//       {/* Background orbs */}
//       <div className="auth-orb auth-orb-1" aria-hidden="true" />
//       <div className="auth-orb auth-orb-2" aria-hidden="true" />

//       <div className="auth-layout">
//         {/* Left — Brand */}
//         <BrandPanel />

//         {/* Right — Form */}
//         <div className="auth-form-panel">

//           {/* Mobile-only mini header */}
//           <div className="auth-mobile-top">
//             <div className="brand-logo-mark">D</div>
//             <span className="brand-logo-name">DocFinder</span>
//           </div>

//           <h1 className="auth-form-title">Welcome back</h1>
//           <p className="auth-form-sub">
//             Don't have an account?{" "}
//             <Link to="/register">Create one free</Link>
//           </p>

//           {error && (
//             <div className="auth-error" role="alert">
//               <span>⚠</span> {error}
//             </div>
//           )}

//           <form className="auth-form" onSubmit={handleSubmit} noValidate>

//             {/* Email */}
//             <div className="field-wrap">
//               <label className="field-label-float" htmlFor="login-email">
//                 Email address
//               </label>
//               <div className="field-input-wrap">
//                 <span className="field-icon">✉</span>
//                 <input
//                   id="login-email"
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

//             {/* Password */}
//             <div className="field-wrap">
//               <label className="field-label-float" htmlFor="login-pw">
//                 Password
//               </label>
//               <div className="field-input-wrap">
//                 <span className="field-icon">🔒</span>
//                 <input
//                   id="login-pw"
//                   type={showPw ? "text" : "password"}
//                   name="password"
//                   className="auth-input"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   autoComplete="current-password"
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
//                     fontSize: "15px", padding: "0",
//                     lineHeight: 1,
//                   }}
//                   aria-label={showPw ? "Hide password" : "Show password"}
//                 >
//                   {showPw ? "🙈" : "👁"}
//                 </button>
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="auth-submit"
//               disabled={loading}
//             >
//               {loading && <span className="btn-spinner" />}
//               {loading ? "Signing in..." : "Sign In →"}
//             </button>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;





import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Auth.css";

/* ── Brand left panel ── */
function BrandPanel() {
  return (
    <div className="auth-brand-panel">
      <div>
        <div className="brand-logo">
          <div className="brand-logo-mark">D</div>
          <span className="brand-logo-name">DocFinder</span>
        </div>

        <p className="brand-tagline">
          Lost documents,<br />
          <span>Found again.</span>
        </p>

        <p className="brand-desc">
          India's first platform where finders upload and owners reclaim — safely, instantly.
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
          <span className="brand-stat-num">2.4k+</span>
          <span className="brand-stat-label">Docs Found</span>
        </div>
        <div className="brand-stat">
          <span className="brand-stat-num">98%</span>
          <span className="brand-stat-label">Return Rate</span>
        </div>
        <div className="brand-stat">
          <span className="brand-stat-num">48h</span>
          <span className="brand-stat-label">Avg. Return</span>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Signing you in...");

    try {
      const res = await api.post("/auth/login", formData);

      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      setUser(user);

      toast.success("Welcome back!", {
        id: loadingToast,
      });

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Please try again.",
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
      <div className="auth-orb auth-orb-1" aria-hidden="true" />
      <div className="auth-orb auth-orb-2" aria-hidden="true" />

      <div className="auth-layout">
        {/* Left */}
        <BrandPanel />

        {/* Right */}
        <div className="auth-form-panel">
          <div className="auth-mobile-top">
            <div className="brand-logo-mark">D</div>
            <span className="brand-logo-name">DocFinder</span>
          </div>

          <h1 className="auth-form-title">Welcome back</h1>

          <p className="auth-form-sub">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="field-wrap">
              <label className="field-label-float">Email address</label>
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
      placeholder="Enter your password"
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
      aria-label={showPw ? "Hide password" : "Show password"}
    >
      {showPw ? "🙈" : "👁"}
    </button>
  </div>

  {/* Forgot Password — bahar nikala */}
  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
    <Link
      to="/forgot-password"
      style={{
        color: "var(--red-bright)",
        fontSize: "13px",
        textDecoration: "none",
        fontWeight: "500",
      }}
    >
      Forgot Password?
    </Link>
  </div>
</div>

            {/* Submit */}
            <button className="auth-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;