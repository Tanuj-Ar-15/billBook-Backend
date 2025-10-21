const { Router } = require("express")
const itemController = require("../controllers/itemController")
const { protect } = require("../middlewares/auth")


const router = Router()

router.post("/create/category"  ,protect, itemController.createCategory )
router.post("/create/size"  ,protect, itemController.createSize )


module.exports = router

