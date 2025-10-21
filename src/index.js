const { app } = require("./app")
const dotenv = require("dotenv")
const requireDir = require("require-dir")
dotenv.config()
const authRoutes = require("./routes/authRoutes")
const { Router } = require("express")
const itemRoutes = require("./routes/itemRoutes")

const router = Router()

const port = process.env.PORT

app.use("/api/v1", router)

requireDir("controllers", { recurse: true })

require("./config/mongoDb")

router.use("/auth", authRoutes)

router.use("/item", itemRoutes)




app.listen(port, () => {
    console.log("Server is running on port: " + port + " & Environment: " + process.env.ENVIRONMENT);

})
