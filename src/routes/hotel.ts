import Router from 'koa-router'
import { listHotels, getHotel, createHotel, updateHotel, deleteHotel } from '../controllers/hotel'
import { auth } from '../middleware/auth'

const router = new Router({ prefix: '/hotels' })

// List all hotels
router.get('/', listHotels)

/**
 * @openapi
 * /hotels:
 *   get:
 *     tags: [Hotel]
 *     summary: Get all hotels
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: star
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotel'
 */

/**
 * @openapi
 * /hotels/{id}:
 *   get:
 *     tags: [Hotel]
 *     summary: Get hotel by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hotel found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: Hotel not found
 */
router.get('/:id', getHotel)

/**
 * @openapi
 * /hotels:
 *   post:
 *     tags: [Hotel]
 *     summary: Create a hotel
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Invalid input
 */
router.post('/', auth(['operator']), createHotel)

/**
 * @openapi
 * /hotels/{id}:
 *   put:
 *     tags: [Hotel]
 *     summary: Update a hotel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Hotel not found
 */
router.put('/:id', auth(['operator']), updateHotel)

/**
 * @openapi
 * /hotels/{id}:
 *   delete:
 *     tags: [Hotel]
 *     summary: Delete a hotel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Hotel not found
 */
router.delete('/:id', auth(['operator']), deleteHotel)

export default router
