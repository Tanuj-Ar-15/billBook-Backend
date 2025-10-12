const { Router } = require("express")
const authController = require("../controllers/authController")
const { protect } = require("../middlewares/auth")


const router = Router()


router.post("/login", authController.login)

router.post("/register", authController.register)


router.post("/verify-login" , authController.verifyLogin)

router.post("/forget-password" , authController.forgotPassword)

router.post("/reset-password" , authController.resetPassword)

router.post("/logout" , authController.logout)
router.get("/read/login/user" , protect , authController.readLoggedUser )
module.exports = router

