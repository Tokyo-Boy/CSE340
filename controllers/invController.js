const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = (data.length > 0) ? data[0].classification_name : "Unknown"

    res.render("inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Deliver vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id) 
    const nav = await utilities.getNav()
    
    if (!data) {
      return next({status: 404, message: "Vehicle not found."})
    }

    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
    const vehicleDetail = await utilities.buildVehicleDetail(data)
    
    res.render("inventory/detail", {
      title: vehicleName,
      nav,
      vehicleDetail,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Trigger Intentional 500 Error (Task 3 Requirement)
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  try {
    throw new Error('Oh no! There was a crash. Maybe try a different route?')
  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Build Inventory Management View (Task 1)
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ***************************
 * Deliver Add Classification View (Task 2)
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 * Process Add Classification (Task 2)
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    let nav = await utilities.getNav() 
    req.flash("success", `The ${classification_name} classification was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("error", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name, // Sticky data
    })
  }
}

/* ***************************
 * Deliver Add Inventory View (Task 3)
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ***************************
 * Process Add Inventory (Task 3)
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    classification_id, inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  } = req.body

  const result = await invModel.addInventory(
    classification_id, inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  )

  if (result) {
    req.flash("success", `The ${inv_make} ${inv_model} was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("error", "Failed to add vehicle.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationSelect,
      errors: null,
      // Provide locals for sticky fields
      classification_id, inv_make, inv_model, inv_year, 
      inv_description, inv_image, inv_thumbnail, 
      inv_price, inv_miles, inv_color
    })
  }
}

module.exports = invCont