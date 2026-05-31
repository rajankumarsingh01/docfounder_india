import { useState } from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../api/axios";

import "./Auth.css";

function ForgotPasswordPage() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!email) {

        toast.error(
          "Please enter your email"
        );

        return;
      }

      setLoading(true);

      const toastId =
        toast.loading(
          "Sending reset link..."
        );

      try {

        const res =
          await api.post(
            "/auth/forgot-password",
            { email }
          );

        toast.success(
          res.data.message,
          {
            id: toastId
          }
        );

        setEmail("");

      } catch (err) {

        toast.error(
          err.response?.data?.message ||
          "Failed to send reset link",
          {
            id: toastId
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

        {/* Left */}
        <div className="auth-brand-panel">

          <div>
            <div className="brand-logo">
              <div className="brand-logo-mark">D</div>

              <span className="brand-logo-name">
                DocFinder
              </span>
            </div>

            <p className="brand-tagline">
              Secure password<br />
              <span>recovery.</span>
            </p>

            <p className="brand-desc">
              Enter your email and we'll
              send you a secure reset link.
            </p>
          </div>

        </div>

        {/* Right */}
        <div className="auth-form-panel">

          <h1 className="auth-form-title">
            Forgot password
          </h1>

          <p className="auth-form-sub">
            Remember your password?{" "}

            <Link to="/login">
              Back to login
            </Link>
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="field-wrap">

              <label className="field-label-float">
                Email address
              </label>

              <div className="field-input-wrap">

                <span className="field-icon">
                  ✉
                </span>

                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <button
              className="auth-submit"
              disabled={loading}
            >
              {
                loading
                  ? "Sending..."
                  : "Send Reset Link →"
              }
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;