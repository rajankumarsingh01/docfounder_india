const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * =====================================
 * User Schema
 * =====================================
 */

const UserSchema =
  new mongoose.Schema(
    {
      /**
       * Full Name
       */
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
      },

      /**
       * Email
       */
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },

      /**
       * Password
       */
      password: {
        type: String,
        required: true,
        minlength: 6,

        // response me password nahi jayega
        select: false
      },

      /**
       * Role
       */
      role: {
        type: String,

        enum: [
          "USER",
          "ADMIN"
        ],

        default: "USER"
      },

      /**
       * Account Status
       */
      isActive: {
        type: Boolean,
        default: true
      },
      /**
 * Password Reset Token
 */
passwordResetToken: {
  type: String,
  default: null
},

/**
 * Password Reset Expiry
 */
passwordResetExpires: {
  type: Date,
  default: null
},
    },
    

    {
      timestamps: true,
      versionKey: false
    }
  );

/**
 * =====================================
 * Password Hash Before Save
 * =====================================
 */

UserSchema.pre(
  "save",
  async function () {

    if (
      !this.isModified(
        "password"
      )
    ) {
      return;
    }

    const salt =
      await bcrypt.genSalt(10);

    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );
  }
);

/**
 * =====================================
 * Compare Password
 * =====================================
 */

UserSchema.methods.comparePassword =
  async function (
    enteredPassword
  ) {

    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

module.exports =
  mongoose.model(
    "User",
    UserSchema
  );