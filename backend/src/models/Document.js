const mongoose = require("mongoose");
const { DOCUMENT_TYPES, DOCUMENT_STATUS } = require("../config/constants");

const DocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      required: true,
      enum: DOCUMENT_TYPES,
    },

    partialName: {
      type: String,
      required: true,
      trim: true,
    },

    foundLocation: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Finder Contact
     * Hidden from public — only revealed after claim is approved
     */
    finderContact: {
      type: String,
      required: true,
      trim: true,
    },

    imagePath: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(DOCUMENT_STATUS),
      default: DOCUMENT_STATUS.FOUND,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * ─── CLAIM SYSTEM ───────────────────────────────────────────
     * claimedBy      → User who submitted the claim request
     * claimerInfo    → Name + reason submitted by the claimer
     * claimRequestedAt → Timestamp of the claim request
     * ────────────────────────────────────────────────────────────
     */
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    claimerInfo: {
      name: { type: String, trim: true, default: null },
      reason: { type: String, trim: true, default: null },
      contact: { type: String, trim: true, default: null },
    },

    claimRequestedAt: {
      type: Date,
      default: null,
    },
    claimStatusUpdatedAt: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Document", DocumentSchema);