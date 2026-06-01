const { validationResult } = require("express-validator");
const ApiResponse    = require("../utils/ApiResponse");
const asyncHandler   = require("../utils/asyncHandler");
const documentService = require("../services/document.service");
const documentDTO    = require("../dtos/document.dto");

/**
 * Upload Document
 */
const uploadDocument = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(new ApiResponse(false, "Validation Failed", errors.array()));
  }

  const { documentType, partialName, foundLocation, finderContact } = req.body;

  const document = await documentService.createDocument({
    documentType,
    partialName,
    foundLocation,
    finderContact,
    imagePath: req.file ? req.file.path : null, // ✅ .filename → .path (Cloudinary URL)
    uploadedBy: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(true, "Document Uploaded Successfully",
      documentDTO(document, { viewerId: req.user._id })
    )
  );
});

/**
 * Search Documents (public)
 */
const getDocuments = asyncHandler(async (req, res) => {
  const { documents, pagination } = await documentService.searchDocuments(req.query);

  const viewerId = req.user?._id;
  const sanitized = documents.map((doc) => documentDTO(doc, { viewerId }));

  return res.json(new ApiResponse(true, "Documents Fetched", {
    documents: sanitized,
    pagination,
  }));
});
/**
 * Get Document By ID (owner only — for edit page)
 */
const getDocumentById = asyncHandler(async (req, res) => {
  const document = await documentService.getDocumentById(req.params.id, req.user._id);
  return res.json(
    new ApiResponse(true, "Document Fetched",
      documentDTO(document, { viewerId: req.user._id })
    )
  );
});

/**
 * Claim Document
 * Body: { name, reason, contact }
 */
const claimDocument = asyncHandler(async (req, res) => {
  const { name, reason, contact } = req.body;

  const document = await documentService.claimDocument(
    req.params.id,
    req.user._id,
    { name, reason, contact }
  );

  return res.json(
    new ApiResponse(true, "Claim Request Submitted Successfully",
      documentDTO(document, { viewerId: req.user._id })
    )
  );
});

/**
 * My Documents
 */
const getMyDocuments = asyncHandler(async (req, res) => {
  const documents = await documentService.getMyDocuments(req.user._id);
  return res.json(
    new ApiResponse(true, "My Documents",
      documents.map((doc) => documentDTO(doc, { viewerId: req.user._id }))
    )
  );
});

/**
 * Dashboard Stats
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await documentService.getDashboardStats(req.user._id);
  return res.json(new ApiResponse(true, "Dashboard Stats", stats));
});

/**
 * Update Document
 */
const updateDocument = asyncHandler(async (req, res) => {
  const document = await documentService.updateDocument(
    req.params.id,
    req.user._id,
    req.body
  );
  return res.json(
    new ApiResponse(true, "Document Updated Successfully",
      documentDTO(document, { viewerId: req.user._id })
    )
  );
});

/**
 * Delete Document
 */
const deleteDocument = asyncHandler(async (req, res) => {
  await documentService.deleteDocument(req.params.id, req.user._id);
  return res.json(new ApiResponse(true, "Document Deleted Successfully"));
});

/**
 * Approve Claim — Only Finder
 */
const approveClaim = asyncHandler(async (req, res) => {
  const document = await documentService.approveClaim(
    req.params.id,
    req.user._id
  );
  return res.json(
    new ApiResponse(true, "Claim Approved",
      documentDTO(document, { viewerId: req.user._id })
    )
  );
});

/**
 * Reject Claim — Only Finder
 */
const rejectClaim = asyncHandler(async (req, res) => {
  const document = await documentService.rejectClaim(
    req.params.id,
    req.user._id
  );
  return res.json(
    new ApiResponse(true, "Claim Rejected",
      documentDTO(document, { viewerId: req.user._id })
    )
  );
});

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  claimDocument,
  getMyDocuments,
  getDashboardStats,
  updateDocument,
  deleteDocument,
  approveClaim,
  rejectClaim,
};