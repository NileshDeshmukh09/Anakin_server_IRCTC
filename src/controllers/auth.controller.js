const db = require("../config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidEmail, validatePassword } = require("../utils/validations");

const pool = db.promise();

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
      return res
        .status(400)
        .json({ success: false, message: passwordValidationMessage });
    }

    const userRole = role || "customer";

    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

    const [result] = await pool.query(query, [
      username,
      email,
      hashedPassword,
      userRole,
    ]);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({
          success: false,
          message: "User with this email already registered",
        });
    }

    // Handle other unexpected errors
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Retrieve user from the database
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.query(query, [email]);
    const user = rows[0];

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid Credential, Please check your email!",
        });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // Token expiration time (e.g., 24 hour)
    });

    res
      .status(200)
      .json({ success: true, message: "User Logged In successful!", token });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
