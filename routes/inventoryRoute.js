const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// --- Task 1 & 3: Dynamic Display Routes ---

// Route to build inventory by classification view (e.g., Sedan, SUV)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build specific vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// --- Inventory Management Routes ---

// Deliver Inventory Management View
router.get("/", utilities.handleErrors(invController.buildManagement));

// Deliver Add Classification View
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Deliver Add Inventory View
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// --- Process Form Submissions (Post) ---

// Process Add Classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),     
  invValidate.checkClassificationData,   
  utilities.handleErrors(invController.addClassification) 
);


router.post(
  "/add-inventory",
  invValidate.inventoryRules(),       
  invValidate.checkInventoryData,     
  utilities.handleErrors(invController.addInventory)
);

router.get("/error", utilities.handleErrors(invController.triggerError));

module.exports = router;