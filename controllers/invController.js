const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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
 * Deliver vehicle detail view (Task 1)
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id) 
    const nav = await utilities.getNav()
    
    // Safety check: if no data found
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
 * Trigger Intentional 500 Error (Task 3)
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  try {
    throw new Error('Oh no! There was a crash. Maybe try a different route?')
  } catch (err) {
    next(err)
  }
}

module.exports = invCont