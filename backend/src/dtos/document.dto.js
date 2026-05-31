/**
 * =====================================
 * Document DTO
 * =====================================
 *
 * Smart contact reveal:
 *  - Public view    → finderContact HIDDEN
 *  - Claimer view   → finderContact REVEALED (after claim submitted)
 *  - Owner view     → finderContact VISIBLE (always)
 *
 * Usage:
 *  documentDTO(doc)                      → public (no contact)
 *  documentDTO(doc, { viewerId: userId }) → smart reveal
 */

  const { DOCUMENT_STATUS } = require("../config/constants");

const documentDTO = (document, options = {}) => {
  const doc = document.toObject ? document.toObject() : document;
  const viewerId = options.viewerId?.toString();

  const uploadedById = doc.uploadedBy?._id?.toString() || doc.uploadedBy?.toString();
  const claimedById  = doc.claimedBy?._id?.toString()  || doc.claimedBy?.toString();

  const isOwner   = viewerId && viewerId === uploadedById;
  const isClaimer = viewerId && viewerId === claimedById;

const isApproved =
  doc.status === DOCUMENT_STATUS.CLAIMED;

/**
 * Reveal finder contact ONLY:
 * - uploader/finder
 * - approved claimer
 */
const revealContact =
  isOwner ||
  (isClaimer && isApproved);





  return {
    id: doc._id,

    // Basic info
    documentType:  doc.documentType,
    partialName:   doc.partialName,
    foundLocation: doc.foundLocation,
    status:        doc.status,

    // Image URL
    // imageUrl: doc.imagePath 
    //   ? `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${doc.imagePath}`
    //   : null,
   imageUrl: doc.imagePath
  ? doc.imagePath.replace("http://", "https://")
  : null,

  
    // Contact — revealed only to owner or claimer
    finderContact: revealContact ? doc.finderContact : undefined,

    // Claim info — visible to owner so they know who claimed
    claimInfo: isOwner && doc.claimedBy
      ? {
          claimerName:       doc.claimerInfo?.name    || null,
          claimerReason:     doc.claimerInfo?.reason  || null,
          claimerContact:    doc.claimerInfo?.contact || null,
          claimRequestedAt:  doc.claimRequestedAt,
        }
      : undefined,

    // Show claimer their own submitted info
    myClaimInfo: isClaimer && !isOwner
      ? {
          name:             doc.claimerInfo?.name    || null,
          reason:           doc.claimerInfo?.reason  || null,
          contact:          doc.claimerInfo?.contact || null,
          claimRequestedAt: doc.claimRequestedAt,
        }
      : undefined,

    createdAt: doc.createdAt,
  };
};

module.exports = documentDTO;