const { Router } = require("express")
const authController = require("../controllers/authController")


const router = Router()


router.post("/login", authController.login)

router.post("/register", authController.register)


router.post("/verify-login" , authController.verifyLogin)
module.exports = router

