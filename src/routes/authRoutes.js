const { Router } = require("express")
const authController = require("../controllers/authController")


const router = Router()


router.post("/test", authController.test)
module.exports = router

