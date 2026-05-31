const sendEmail =
  require("../utils/sendEmail");

/**
 * =========================================
 * Claim Request Email
 * Sent to document uploader/finder
 * =========================================
 */
const sendClaimRequestEmail =
  async ({
    uploader,
    document,
    claimerInfo
  }) => {

    await sendEmail({

      to:
        uploader.email,

      subject:
        "New Claim Request on Your Document",

      html: `
        <div style="font-family:Arial;padding:20px;line-height:1.6;">

          <h2 style="color:#e8352a;">
            New Claim Request
          </h2>

          <p>
            Hello ${uploader.name},
          </p>

          <p>
            Someone has submitted a claim request
            for your uploaded document.
          </p>

          <hr />

          <h3>Document Details</h3>

          <p>
            <b>Type:</b>
            ${document.documentType}
          </p>

          <p>
            <b>Partial Name:</b>
            ${document.partialName}
          </p>

          <p>
            <b>Found Location:</b>
            ${document.foundLocation}
          </p>

          <hr />

          <h3>Claimer Information</h3>

          <p>
            <b>Name:</b>
            ${claimerInfo.name}
          </p>

          <p>
            <b>Reason:</b>
            ${claimerInfo.reason}
          </p>

          <p>
            <b>Contact:</b>
            ${claimerInfo.contact || "Not Provided"}
          </p>

          <br />

          <p>
            Please login to DocFinder
            to approve or reject this claim.
          </p>

        </div>
      `
    });
  };

/**
 * =========================================
 * Claim Approved Email
 * Sent to claimer
 * =========================================
 */
const sendClaimApprovedEmail =
  async ({
    claimer,
    document
  }) => {

    await sendEmail({

      to:
        claimer.email,

      subject:
        "Your Claim Has Been Approved",

      html: `
        <div style="font-family:Arial;padding:20px;line-height:1.6;">

          <h2 style="color:green;">
            Claim Approved
          </h2>

          <p>
            Hello ${claimer.name},
          </p>

          <p>
            Your claim request has been approved.
          </p>

          <hr />

          <h3>Document Details</h3>

          <p>
            <b>Type:</b>
            ${document.documentType}
          </p>

          <p>
            <b>Partial Name:</b>
            ${document.partialName}
          </p>

          <p>
            <b>Found Location:</b>
            ${document.foundLocation}
          </p>

          <hr />

          <h3>Finder Contact Details</h3>

          <p>
            <b>Finder Contact:</b>
            ${document.finderContact}
          </p>

          <br />

          <p>
            Please contact the finder
            to collect your document.
          </p>

        </div>
      `
    });
  };

/**
 * =========================================
 * Claim Rejected Email
 * Sent to claimer
 * =========================================
 */
const sendClaimRejectedEmail =
  async ({
    claimer,
    document
  }) => {

    await sendEmail({

      to:
        claimer.email,

      subject:
        "Your Claim Has Been Rejected",

      html: `
        <div style="font-family:Arial;padding:20px;line-height:1.6;">

          <h2 style="color:red;">
            Claim Rejected
          </h2>

          <p>
            Hello ${claimer.name},
          </p>

          <p>
            Unfortunately, your claim request
            has been rejected by the finder.
          </p>

          <hr />

          <h3>Document Details</h3>

          <p>
            <b>Type:</b>
            ${document.documentType}
          </p>

          <p>
            <b>Partial Name:</b>
            ${document.partialName}
          </p>

          <p>
            <b>Found Location:</b>
            ${document.foundLocation}
          </p>

          <br />

          <p>
            You may search for other matching documents
            on DocFinder.
          </p>

        </div>
      `
    });
  };

module.exports = {
  sendClaimRequestEmail,
  sendClaimApprovedEmail,
  sendClaimRejectedEmail,
};