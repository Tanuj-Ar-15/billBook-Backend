const { Router } = require("express");
const itemController = require("../controllers/itemController");
const { protect } = require("../middlewares/auth");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: APIs for managing restaurant items, categories, and sizes
 */

/**
 * @swagger
 * /api/v1/item/create/category:
 *   post:
 *     summary: Create a new item category
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Beverages
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Missing category name or unauthorized
 */
router.post("/create/category", protect, itemController.createCategory);

/**
 * @swagger
 * /api/v1/item/create/size:
 *   post:
 *     summary: Create a new item size
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Large
 *     responses:
 *       201:
 *         description: Item size created successfully
 *       400:
 *         description: Missing size name or unauthorized
 */
router.post("/create/size", protect, itemController.createSize);

/**
 * @swagger
 * /api/v1/item/create:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemName
 *               - category_id
 *               - price
 *             properties:
 *               itemName:
 *                 type: string
 *                 example: Pizza Margherita
 *               description:
 *                 type: string
 *                 example: Classic cheese pizza
 *               isVeg:
 *                 type: boolean
 *                 example: true
 *               category_id:
 *                 type: string
 *                 example: 64f2e8b123abc456def78901
 *               price:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - size_id
 *                     - price
 *                   properties:
 *                     size_id:
 *                       type: string
 *                       example: 64f2e8b123abc456def78902
 *                     price:
 *                       type: number
 *                       example: 250
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Missing fields or unauthorized
 */
router.post("/create", protect, itemController.createItem);

/**
 * @swagger
 * /api/v1/item/fetch:
 *   get:
 *     summary: Fetch all items for logged-in restaurant
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of items with category and size populated
 *       400:
 *         description: Unauthorized
 */
router.get("/fetch", protect, itemController.getItems);

/**
 * @swagger
 * /api/v1/item/fetch/catgories:
 *   get:
 *     summary: Fetch all categories for logged-in restaurant
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       400:
 *         description: Unauthorized
 */
router.get("/fetch/catgories", protect, itemController.getCategories);

/**
 * @swagger
 * /api/v1/item/fetch/size:
 *   get:
 *     summary: Fetch all item sizes for logged-in restaurant
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of item sizes
 *       400:
 *         description: Unauthorized
 */
router.get("/fetch/size", protect, itemController.getSizes);

module.exports = router;
