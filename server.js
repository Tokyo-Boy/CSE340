/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const dotenv = require("dotenv")
dotenv.config() // Must be at the very top to load variables early
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const app = express()
const utilities = require("./utilities/")
const path = require("path")

// Require internal modules after dotenv
const baseController = require("./controllers/baseController")
const static = require("./routes/static")
const inventoryRoute = require("./controllers/inventoryRoute")

/* ***********************
 * View Engine and Layouts
 *************************/
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Inventory routes
app.use("/inv", inventoryRoute)

// Index route
app.get("/", baseController.buildHome)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from environment variables
 *************************/
const port = process.env.PORT || 10000
const host = process.env.HOST || '0.0.0.0' 

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
