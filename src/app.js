const express = require("express")
const path = require("path")
const morgan = require("morgan")
const cors = require("cors")
const dotenv = require("dotenv")

const contactsRouter = require("./contacts/contacts.route")

exports.Server = class {
  async start() {
    this.initServer()
    this.initConfig()
    this.initMiddlewares()
    this.initRoutes()
    this.initErrorHandling()
    this.startListening()
  }

  initServer() {
    this.server = express()
  }

  initConfig() {
    dotenv.config({ path: path.join(__dirname, "../.env") })
  }

  initMiddlewares() {
    const formatsLogger = this.server.get("env") === "development" ? "dev" : "short"

    this.server.use(express.json())
    this.server.use(morgan(formatsLogger))
    this.server.use(cors({ origin: "*" }))
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRouter)
  }

  initErrorHandling() {
    this.server.use((err, res) => {
      const statusCode = err.status || 500
      return res.status(statusCode).send({
        name: err.name,
        status: statusCode,
        message: err.message,
      })
    })
  }



  startListening() {
    const PORT = process.env.PORT || 3000

    this.server.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  }

 
}
