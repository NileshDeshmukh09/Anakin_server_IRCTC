// src/routes/user.js
const express = require("express");
const router = express.Router();

const authController = require("../../controllers/auth.controller");
const trainController = require("../../controllers/train.controller");
const bookingController = require("../../controllers/booking.controller");
const { JWTAuth } = require("../../middlewares");



router.post("/auth/register", authController.registerUser);
router.post("/auth/login", authController.loginUser);
router.post(
    "/trains",
    [JWTAuth.verifyToken, JWTAuth.authenticateAdminApiKey],
    trainController.addNewTrain
  );
router.get("/seatAvailability", trainController.getSeatAvailability);
router.post("/book-seats", [JWTAuth.verifyToken], bookingController.bookSeat);
router.get(
  "/book-seats/:bookingId",
  [JWTAuth.verifyToken],
  bookingController.getBookingDetails
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided credentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user
 *               role:
 *                 type: string
 *                 enum: [admin, customer]
 *                 default: customer
 *                 description: The role of the user (admin or user)
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Bad request, missing or invalid parameters
 *       '500':
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and generate access token
 *     description: Authenticate a user with the provided credentials and generate an access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user
 *     responses:
 *       '200':
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token for authenticated user
 *       '401':
 *         description: Unauthorized, invalid credentials
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /trains:
 *   post:
 *     summary: Add a new train (admin only)
 *     description: Add a new train to the system. Requires admin privileges.
 *     security:
 *       - JWTAuth: []  # Uses the JWT token for authentication
 *       - ApiKeyAuth: []  # Uses the API key for authentication
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: JWT token obtained upon user authentication
 *         schema:
 *           type: string
 *       - in: header
 *         name: api-key
 *         required: true
 *         description: API key required for admin authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the train
 *               source:
 *                 type: string
 *                 description: The source station of the train
 *               destination:
 *                 type: string
 *                 description: The destination station of the train
 *               total_seats:
 *                 type: integer
 *                 minimum: 1
 *                 description: The total number of seats available in the train
 *     responses:
 *       '201':
 *         description: Train added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Train added successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '401':
 *         description: Unauthorized, authentication failed
 *       '403':
 *         description: Forbidden, user does not have required privileges
 *       '500':
 *         description: Internal Server Error
 */



/**
 * @swagger
 * /seatAvailability:
 *   get:
 *     summary: Get seat availability between source and destination
 *     description: Retrieve seat availability for trains between the specified source and destination stations.
 *     parameters:
 *       - in: query
 *         name: source
 *         required: true
 *         description: The source station name
 *         schema:
 *           type: string
 *       - in: query
 *         name: destination
 *         required: true
 *         description: The destination station name
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Seat availability retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Seat availability retrieved successfully
 *                 trains:
 *                   type: array
 *                   description: List of trains between the specified source and destination
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the train
 *                       availableSeats:
 *                         type: integer
 *                         description: Number of available seats on the train
 *       '400':
 *         description: Bad request, invalid input data
 *       '404':
 *         description: No trains found between the specified source and destination
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /book-seats:
 *   post:
 *     summary: Book seats on a train
 *     description: Book a specified number of seats on a train using the provided authentication token.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token received upon successful login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trainId:
 *                 type: integer
 *                 description: The ID of the train to book seats on
 *               seats:
 *                 type: integer
 *                 description: The number of seats to book
 *     responses:
 *       '200':
 *         description: Seats booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Seats booked successfully
 *       '400':
 *         description: Bad request, invalid input data
 *       '404':
 *         description: Train not found or insufficient seats available
 *       '500':
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /book-seats/{bookingId}:
 *   get:
 *     summary: Get specific booking details
 *     description: Retrieve details of a specific booking identified by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the booking to retrieve details for
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token received upon successful login
 *     responses:
 *       '200':
 *         description: Booking details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the booking
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   description: The ID of the user who made the booking
 *                   example: 123
 *                 trainId:
 *                   type: integer
 *                   description: The ID of the train booked
 *                   example: 456
 *                 seatsBooked:
 *                   type: integer
 *                   description: The number of seats booked
 *                   example: 2
 *       '404':
 *         description: Booking not found
 *       '500':
 *         description: Internal Server Error
*/

module.exports = router;
