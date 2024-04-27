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
router.get("/book-seats/:bookingId", [JWTAuth.verifyToken], bookingController.getBookingDetails);

module.exports = router;
