const db = require("../config/db.config");
const { validateRequiredFields } = require("../utils/validations");

const pool = db.promise();

const addNewTrain = async (req, res) => {
  const { name, source, destination, total_seats } = req.body;

  try {
    const requiredFieldsValidation = validateRequiredFields([
      { name: "name", value: name },
      { name: "source", value: source },
      { name: "destination", value: destination },
      { name: "total_seats", value: total_seats },
    ]);

    if (!requiredFieldsValidation.success) {
      return res.status(400).json(requiredFieldsValidation);
    }

    if (isNaN(total_seats) || total_seats <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid total_seats" });
    }

    const query =
      "INSERT INTO trains (name, source, destination, total_seats) VALUES (?, ?, ?, ?)";
    const [result] = await pool.query(query, [
      name,
      source,
      destination,
      total_seats,
    ]);

    res
      .status(201)
      .json({ success: true, message: "Train added successfully" });
  } catch (error) {
    console.error("Error adding new train:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add new train" });
  }
};

const getSeatAvailability = async (req, res) => {
  const { source, destination } = req.body;

  try {
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: "Source and destination are required",
      });
    }

    const query = `
    SELECT * FROM trains WHERE source = ? AND destination = ?
    `;
    const [rows] = await pool.query(query, [source, destination]);
    res
      .status(200)
      .json({ success: true, totoalTrains: rows.length, trains: rows });
  } catch (error) {
    console.error("Error fetching seat availability:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch seat availability" });
  }
};

module.exports = { addNewTrain, getSeatAvailability };
