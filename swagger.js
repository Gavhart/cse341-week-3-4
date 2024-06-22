/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - category
 *         - price
 *         - stock
 *         - rating
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the item
 *         name:
 *           type: string
 *           description: The name of the item
 *         description:
 *           type: string
 *           description: The item description
 *         category:
 *           type: string
 *           description: The category of the item
 *         price:
 *           type: number
 *           description: The price of the item
 *         stock:
 *           type: number
 *           description: The stock level of the item
 *         rating:
 *           type: number
 *           description: The rating of the item
 *       example:
 *         id: d5fE_asz
 *         name: Sample Item
 *         description: This is a sample item
 *         category: Electronics
 *         price: 100
 *         stock: 50
 *         rating: 4.5
 */

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: The items managing API
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Returns the list of all the items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: The list of the items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Other routes with similar comments...