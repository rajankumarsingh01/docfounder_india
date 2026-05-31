const mongoose = require("mongoose");
const Document = require("../models/Document");
const AppError = require("../utils/AppError");
const { DOCUMENT_STATUS } = require("../config/constants");



const {
  sendClaimRequestEmail,
  sendClaimApprovedEmail,
  sendClaimRejectedEmail,
} = require("./document.email");


/**
 * Create New Document
 */
const createDocument = async (data) => {
  const document = await Document.create(data);
  return document;
};

/**
 * Search Documents (public)
 * Only FOUND + PENDING_CLAIM visible
 */
const searchDocuments = async (filters) => {
  const query = {
    status: { $in: [DOCUMENT_STATUS.FOUND, DOCUMENT_STATUS.PENDING_CLAIM] },
  };

  if (filters.documentType) query.documentType = filters.documentType;
  if (filters.location) {
    query.foundLocation = { $regex: filters.location, $options: "i" };
  }
  if (filters.name) {
    query.partialName = { $regex: filters.name, $options: "i" };
  }

  return await Document.find(query).sort({ createdAt: -1 });
};

/**
 * Get Document By ID
 * Only owner can access (for edit page)
 */
const getDocumentById = async (documentId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("Invalid Document ID", 400);
  }

  const document = await Document.findById(documentId);
  if (!document) throw new AppError("Document Not Found", 404);

  if (document.uploadedBy.toString() !== userId.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  return document;
};

/**
 * ─── CLAIM DOCUMENT ──────────────────────────────────────────────────
 */
// const claimDocument = async (documentId, claimerId, claimerInfo) => {
//   if (!mongoose.Types.ObjectId.isValid(documentId)) {
//     throw new AppError("Invalid Document ID", 400);
//   }

//   const document = await Document.findById(documentId);
//   if (!document) throw new AppError("Document Not Found", 404);

//   if (document.uploadedBy.toString() === claimerId.toString()) {
//     throw new AppError("You cannot claim your own document", 400);
//   }

//   if (document.status === DOCUMENT_STATUS.PENDING_CLAIM) {
//     throw new AppError("A claim is already pending on this document", 400);
//   }
//   if (document.status === DOCUMENT_STATUS.CLAIMED) {
//     throw new AppError("This document has already been claimed", 400);
//   }

//   if (!claimerInfo?.name || !claimerInfo?.reason) {
//     throw new AppError("Name and reason are required to claim", 400);
//   }

//   // FIX: returnDocument → new: true
//   const updated = await Document.findByIdAndUpdate(
//     documentId,
//     {
//       status: DOCUMENT_STATUS.PENDING_CLAIM,
//       claimedBy: claimerId,
//       claimerInfo: {
//         name: claimerInfo.name,
//         reason: claimerInfo.reason,
//         contact: claimerInfo.contact || null,
//       },
//       claimRequestedAt: new Date(),
//     },
//     { new: true }
//   );

//   return updated;
// };


const claimDocument = async (
  documentId,
  claimerId,
  claimerInfo
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      documentId
    )
  ) {
    throw new AppError(
      "Invalid Document ID",
      400
    );
  }

  /**
   * Get Document + uploader info
   */
  const document =
    await Document.findById(
      documentId
    ).populate(
      "uploadedBy",
      "name email"
    );

  if (!document) {
    throw new AppError(
      "Document Not Found",
      404
    );
  }

  /**
   * Prevent self claim
   */
  if (
    document.uploadedBy._id.toString() ===
    claimerId.toString()
  ) {
    throw new AppError(
      "You cannot claim your own document",
      400
    );
  }

  /**
   * Prevent duplicate/past claims
   */
  if (
    document.status ===
    DOCUMENT_STATUS.PENDING_CLAIM
  ) {
    throw new AppError(
      "A claim is already pending on this document",
      400
    );
  }

  if (
    document.status ===
    DOCUMENT_STATUS.CLAIMED
  ) {
    throw new AppError(
      "This document has already been claimed",
      400
    );
  }

  /**
   * Validation
   */
  if (
    !claimerInfo?.name ||
    !claimerInfo?.reason
  ) {
    throw new AppError(
      "Name and reason are required to claim",
      400
    );
  }

  /**
   * Update document
   */
  document.status =
    DOCUMENT_STATUS.PENDING_CLAIM;

  document.claimedBy =
    claimerId;

  document.claimerInfo = {
    name:
      claimerInfo.name,

    reason:
      claimerInfo.reason,

    contact:
      claimerInfo.contact || null,
  };

  document.claimRequestedAt =
    new Date();

  document.claimStatusUpdatedAt =
    new Date();

  await document.save();

  /**
   * Send email to uploader
   */
  await sendClaimRequestEmail({

    uploader:
      document.uploadedBy,

    document,

    claimerInfo:
      document.claimerInfo
  });

  return document;
};

/**
 * Get My Documents (uploader's view)
 */
const getMyDocuments = async (userId) => {
  return await Document.find({ uploadedBy: userId })
    .sort({ createdAt: -1 })
    .populate("claimedBy", "name email");
};

/**
 * Dashboard Stats
 */
const getDashboardStats = async (userId) => {
  const [totalUploads, foundDocuments, pendingClaims, claimedDocuments] =
    await Promise.all([
      Document.countDocuments({ uploadedBy: userId }),
      Document.countDocuments({ uploadedBy: userId, status: DOCUMENT_STATUS.FOUND }),
      Document.countDocuments({ uploadedBy: userId, status: DOCUMENT_STATUS.PENDING_CLAIM }),
      Document.countDocuments({ uploadedBy: userId, status: DOCUMENT_STATUS.CLAIMED }),
    ]);

  return { totalUploads, foundDocuments, pendingClaims, claimedDocuments };
};

/**
 * Update Document (owner only)
 */
const updateDocument = async (documentId, userId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("Invalid Document ID", 400);
  }

  const document = await Document.findById(documentId);
  if (!document) throw new AppError("Document Not Found", 404);

  if (document.uploadedBy.toString() !== userId.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  const allowedFields = ["documentType", "partialName", "foundLocation", "finderContact"];
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) document[field] = updateData[field];
  });

  await document.save();
  return document;
};

/**
 * Delete Document (owner only)
 */
const deleteDocument = async (documentId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("Invalid Document ID", 400);
  }

  const document = await Document.findById(documentId);
  if (!document) throw new AppError("Document Not Found", 404);

  if (document.uploadedBy.toString() !== userId.toString()) {
    throw new AppError("Unauthorized", 403);
  }

  await document.deleteOne();
  return true;
};

/**
 * Approve Claim — Only finder (uploadedBy) kar sakta hai
 */
/**
 * Approve Claim — Only finder can approve
 */
const approveClaim = async (
  documentId,
  userId
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      documentId
    )
  ) {
    throw new AppError(
      "Invalid Document ID",
      400
    );
  }

  /**
   * Populate claimer
   */
  const doc =
    await Document.findById(
      documentId
    )
      .populate(
        "claimedBy",
        "name email"
      );

  if (!doc) {
    throw new AppError(
      "Document not found",
      404
    );
  }

  /**
   * Only finder can approve
   */
  if (
    doc.uploadedBy.toString() !==
    userId.toString()
  ) {
    throw new AppError(
      "Only the finder can approve claims",
      403
    );
  }

  /**
   * Must be pending
   */
  if (
    doc.status !==
    DOCUMENT_STATUS.PENDING_CLAIM
  ) {
    throw new AppError(
      "No pending claim on this document",
      400
    );
  }

  /**
   * Update status
   */
  doc.status =
    DOCUMENT_STATUS.CLAIMED;

  doc.claimStatusUpdatedAt =
    new Date();

  await doc.save();

  /**
   * Send approval email
   */
  if (doc.claimedBy) {

    await sendClaimApprovedEmail({

      claimer:
        doc.claimedBy,

      document:
        doc
    });
  }

  return doc;
};


/**
 * Reject Claim — Status wapas FOUND, claim info clear
 */
const rejectClaim = async (
  documentId,
  userId
) => {

  if (
    !mongoose.Types.ObjectId.isValid(
      documentId
    )
  ) {
    throw new AppError(
      "Invalid Document ID",
      400
    );
  }

  /**
   * Populate claimer
   */
  const doc =
    await Document.findById(
      documentId
    )
      .populate(
        "claimedBy",
        "name email"
      );

  if (!doc) {
    throw new AppError(
      "Document not found",
      404
    );
  }

  /**
   * Only finder can reject
   */
  if (
    doc.uploadedBy.toString() !==
    userId.toString()
  ) {
    throw new AppError(
      "Only the finder can reject claims",
      403
    );
  }

  /**
   * Must be pending
   */
  if (
    doc.status !==
    DOCUMENT_STATUS.PENDING_CLAIM
  ) {
    throw new AppError(
      "No pending claim on this document",
      400
    );
  }

  /**
   * Send rejection email BEFORE clearing
   */
  if (doc.claimedBy) {

    await sendClaimRejectedEmail({

      claimer:
        doc.claimedBy,

      document:
        doc
    });
  }

  /**
   * Reset document
   */
  doc.status =
    DOCUMENT_STATUS.FOUND;

  doc.claimedBy =
    null;

  doc.claimerInfo = {
    name: null,
    reason: null,
    contact: null,
  };

  doc.claimRequestedAt =
    null;

  doc.claimStatusUpdatedAt =
    new Date();

  await doc.save();

  return doc;
};

module.exports = {
  createDocument,
  searchDocuments,
  getDocumentById,
  claimDocument,
  getMyDocuments,
  getDashboardStats,
  updateDocument,
  deleteDocument,
  approveClaim,
  rejectClaim,
};