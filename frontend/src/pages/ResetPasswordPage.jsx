import {
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../api/axios";

import "./Auth.css";

function ResetPasswordPage() {

  const navigate =
    useNavigate();

  const { token } =
    useParams();

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPw, setShowPw] =
    useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!password ||
          !confirmPassword) {

        toast.error(
          "Please fill all fields"
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {

        toast.error(
          "Passwords do not match"
        );

        return;
      }

      if (
        password.length < 6
      ) {

        toast.error(
          "Password must be at least 6 characters"
        );

        return;
      }

      setLoading(true);

      const toastId =
        toast.loading(
          "Resetting password..."
        );

      try {

        const res =
          await api.post(
            `/auth/reset-password/${token}`,
            { password }
          );

        toast.success(
          res.data.message,
          {
            id: toastId
          }
        );

        navigate("/login");

      } catch (err) {

        toast.error(
          err.response?.data?.message ||
          "Reset failed",
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

        <div className="auth-brand-panel">

          <div>
            <div className="brand-logo">
              <div className="brand-logo-mark">D</div>

              <span className="brand-logo-name">
                DocFinder
              </span>
            </div>

            <p className="brand-tagline">
              Create a new<br />
              <span>secure password.</span>
            </p>

            <p className="brand-desc">
              Your new password should
              be strong and unique.
            </p>
          </div>

        </div>

        <div className="auth-form-panel">

          <h1 className="auth-form-title">
            Reset password
          </h1>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="field-wrap">

              <label className="field-label-float">
                New password
              </label>

              <div className="field-input-wrap">

                <span className="field-icon">
                  🔒
                </span>

                <input
                  type={
                    showPw
                      ? "text"
                      : "password"
                  }

                  className="auth-input"

                  placeholder="Enter new password"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  style={{
                    paddingRight: "46px"
                  }}
                />

                <button
                  type="button"

                  onClick={() =>
                    setShowPw((p) => !p)
                  }

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
            </div>

            <div className="field-wrap">

              <label className="field-label-float">
                Confirm password
              </label>

              <div className="field-input-wrap">

                <span className="field-icon">
                  🔒
                </span>

                <input
                  type={
                    showPw
                      ? "text"
                      : "password"
                  }

                  className="auth-input"

                  placeholder="Confirm password"

                  value={confirmPassword}

                  onChange={(e) =>
                    setConfirmPassword(
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
                  ? "Updating..."
                  : "Reset Password →"
              }
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;