const db = require("../config/db.config");
const { validateRequiredFields } = require("../utils/validations");

const pool = db.promise();


const bookSeat = async (req, res) => {
  const { trainId, seats } = req.body;
  const userId = req.id;

  try {

    const requiredFieldsValidation = validateRequiredFields([
      { name: "trainId", value: trainId },
      { name: "seats", value: seats },
    ]);

    if (!requiredFieldsValidation.success) {
      return res.status(400).json(requiredFieldsValidation);
    }

    // Start a transaction
    await pool.query("START TRANSACTION");

    // Fetch total seats of the train and lock the row for update
    const result = await pool.query(
      "SELECT total_seats FROM trains WHERE id = ? FOR UPDATE",
      [trainId]
    );

    if (result.length === 0) {
      await pool.query("ROLLBACK");
      return res
        .status(404)
        .json({success : false , message:  "Train not found!"});
    }

    const availableSeats = result[0].total_seats;
    if (availableSeats < seats) {
      await pool.query("ROLLBACK");
      return res
        .status(400)
        .json({ status: "Not enough seats available", status_code: 400 });
    }

    // Update total seats of the train
    await pool.query(
      "UPDATE trains SET total_seats = total_seats - ? WHERE id = ?",
      [seats, trainId]
    );

    // Record booking details
    await pool.query(
      "INSERT INTO bookings (userId, trainId, seats_booked) VALUES (?, ?, ?)",
      [userId, trainId, seats]
    );

    // Commit the transaction
    await pool.query("COMMIT");

    // Respond with success message
    res
      .status(200)
      .json({ status: "Seat booked successfully", status_code: 200 });
  } catch (error) {
    // Rollback transaction on error
    await pool.query("ROLLBACK");
    console.error("Error booking seat:", error);
    res.status(500).json({ status: "Internal Server Error", status_code: 500 });
  }
};

const getBookingDetails = async (req, res) => {
    const { bookingId } = req.params;

    if( !bookingId ) {
        return res.status(400).json({ success: false, message: "Booking ID is required!" });
    }
  const userId = req.id;

  try {
    const query = `SELECT b.id, t.name, t.source, t.destination, b.seats_booked FROM bookings b JOIN trains t ON b.trainId = t.id WHERE b.id = ? AND b.userId = ?`;
    const result = await pool.query(query, [bookingId, userId]);
    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found!" });

    }
    res.status(200).json({ success: true, booking: result[0] });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch booking details" });
  }
};



module.exports = { bookSeat , getBookingDetails };
