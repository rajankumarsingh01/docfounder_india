const express =
  require("express");

const router =
  express.Router();

const {upload } =
  require("../config/multer");

const controller =
  require(
    "../controllers/document.controller"
  );
  const {
  uploadLimiter
} = require(
  "../middlewares/rateLimit.middleware"
);

const {
  createDocumentValidation
} = require(
  "../validators/document.validator"
);


const {
  protect
} = require(
  "../middlewares/auth.middleware"
);

/**
 * Upload Document
 */
router.post(
  "/",
  protect,
  uploadLimiter,
  upload.single("image"),
  createDocumentValidation,
  controller.uploadDocument
);

/**
 * Search Documents
 */
router.get(
  "/",
  controller.getDocuments
);

router.get(
  "/my",
  protect,
  controller.getMyDocuments
);

router.get(
  "/dashboard",
  protect,
  controller.getDashboardStats
);

/**
 * Update Document
 */
router.put(
  "/:id",
  protect,
  controller.updateDocument
);

/**
 * Delete Document
 */
router.delete(
  "/:id",
  protect,
  controller.deleteDocument
);

router.get(
  "/:id",
  protect,
  controller.getDocumentById
);

/**
 * Claim Document
 */
router.patch(
  "/:id/claim",
  protect,
  controller.claimDocument
);


// Existing claim route ke neeche add karo:
router.patch("/:id/approve-claim", protect, controller.approveClaim);
router.patch("/:id/reject-claim",  protect, controller.rejectClaim);




module.exports = router;