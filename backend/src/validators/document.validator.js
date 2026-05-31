const { body } =
  require("express-validator");

/**
 * Upload Validation
 */
const createDocumentValidation = [

  body("documentType")
    .notEmpty()
    .withMessage(
      "Document type is required"
    ),

  body("partialName")
    .trim()
    .notEmpty()
    .withMessage(
      "Partial name is required"
    ),

  body("foundLocation")
    .trim()
    .notEmpty()
    .withMessage(
      "Location is required"
    ),

  body("finderContact")
    .trim()
    .notEmpty()
    .withMessage(
      "Finder contact is required"
    )
];

module.exports = {
  createDocumentValidation
};