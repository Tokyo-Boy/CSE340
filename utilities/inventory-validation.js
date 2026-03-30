const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric() 
      .withMessage("Please provide a valid classification name (alphanumeric only, no spaces)."),
  ]
}

/* ******************************
 * Check Classification Data
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* **********************************
 * Inventory Validation Rules (Task 3)
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification."),

    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_price")
      .trim()
      .isDecimal()
      .withMessage("Price must be a number (decimals allowed)."),

    body("inv_year")
      .trim()
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be a 4-digit number."),

    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Miles must be a number."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
  ]
}

/* ******************************
 * Check Inventory Data (Task 3)
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { 
    classification_id, inv_make, inv_model, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color 
  } = req.body
  
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    let classificationSelect = await utilities.buildClassificationList(classification_id)
    
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationSelect,

      classification_id, inv_make, inv_model, inv_year, 
      inv_description, inv_image, inv_thumbnail, 
      inv_price, inv_miles, inv_color
    })
    return
  }
  next()
}

module.exports = validate