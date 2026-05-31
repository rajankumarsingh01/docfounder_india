const User =
  require("../../models/User");

const AppError =
  require("../../utils/AppError");

const generateToken =
  require("../../utils/generateToken");


  const crypto =
  require("crypto");

const sendEmail =
  require("../../utils/sendEmail");

const env =
  require("../../config/env");

/**
 * =====================================
 * Register User
 * =====================================
 */
const registerUser =
  async ({
    name,
    email,
    password
  }) => {

    /**
     * Check Existing User
     */
    const existingUser =
      await User.findOne({
        email
      });

    if (existingUser) {

      throw new AppError(
        "User already exists",
        409
      );
    }

    /**
     * Create User
     */
    const user =
      await User.create({
        name,
        email,
        password
      });

    /**
     * Generate JWT
     */
    const token =
      generateToken(
        user._id,
        user.role
      );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  };

/**
 * =====================================
 * Login User
 * =====================================
 */
const loginUser =
  async ({
    email,
    password
  }) => {

    /**
     * Need Password
     */
    const user =
      await User.findOne({
        email
      }).select("+password");

    if (!user) {

      throw new AppError(
        "Invalid Email or Password",
        401
      );
    }

    /**
     * Compare Password
     */
    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {

      throw new AppError(
        "Invalid Email or Password",
        401
      );
    }

    /**
     * Generate JWT
     */
    const token =
      generateToken(
        user._id,
        user.role
      );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  };


  const forgotPassword =
  async (email) => {

    const user =
      await User.findOne({
        email
      });

    if (!user) {

      throw new AppError(
        "No account found with this email",
        404
      );
    }

    /**
     * Generate Raw Token
     */
    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    /**
     * Hash Token
     */
    const hashedToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    /**
     * Save in DB
     */
    user.passwordResetToken =
      hashedToken;

    user.passwordResetExpires =
      Date.now() +
      15 * 60 * 1000;

    await user.save();

    /**
     * Reset URL
     */
    const resetUrl =
      `${env.CLIENT_URL}/reset-password/${resetToken}`;

    /**
     * Send Email
     */
    await sendEmail({

      to: user.email,

      subject:
        "Reset Your Password - DocFinder",

      html: `
        <div style="font-family:sans-serif;">
          <h2>Reset Your Password</h2>

          <p>
            Click the button below to reset your password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#e8352a;
              color:white;
              text-decoration:none;
              border-radius:8px;
            "
          >
            Reset Password
          </a>

          <p>
            This link expires in 15 minutes.
          </p>
        </div>
      `
    });

    return true;
  };


  const resetPassword =
  async (
    token,
    password
  ) => {

    /**
     * Hash Incoming Token
     */
    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    /**
     * Find User
     */
    const user =
      await User.findOne({

        passwordResetToken:
          hashedToken,

        passwordResetExpires: {
          $gt: Date.now()
        }
      }).select("+password");

    if (!user) {

      throw new AppError(
        "Invalid or expired reset token",
        400
      );
    }

    /**
     * Update Password
     */
    user.password =
      password;

    /**
     * Clear Reset Fields
     */
    user.passwordResetToken =
      null;

    user.passwordResetExpires =
      null;

    await user.save();

    return true;
  };

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
};