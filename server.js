/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const dotenv = require("dotenv").config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const app = express()
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")

// Internal modules
const utilities = require("./utilities/")
const baseController = require("./controllers/baseController")
const static = require("./routes/static")
const inventoryRoute = require("./controllers/inventoryRoute")


/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


/* ***********************
 * View Engine and Layouts
 *************************/
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware (Fail-Safe Session/Flash)
 *************************/
try {
  const session = require("express-session")
  const flash = require("connect-flash")

  app.use(session({
    secret: process.env.SESSION_SECRET || 'developer-secret-key',
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  }))

  app.use(flash())

  app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res)
    next()
  })
} catch (e) {

  app.use((req, res, next) => {
    res.locals.messages = () => ""
    next()
  })
}

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute)
app.get("/", baseController.buildHome)
app.use("/account", accountRoute)
// Account routes
app.use("/account", require("./routes/accountRoute"))


/* ***********************
 * Error Handling
 *************************/
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

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
 *************************/
const port = process.env.PORT || 10000
const host = process.env.HOST || '0.0.0.0' 

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})