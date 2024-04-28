const jwt = require("jsonwebtoken");
const db = require("../config/db.config");

const pool = db.promise();

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token Provided",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "UnAuthorised",
      });
    }

    req.id = decoded.id;
    next();
  });
}

const authenticateAdminApiKey = async (req, res, next) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.id]);
  const user = rows[0];
  if (user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin access only");
  }
  const apiKey = req.headers["api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).send("Unauthorized: Invalid API key");
  }
  next();
};

const authJWT = {
  verifyToken,
  authenticateAdminApiKey,
};

module.exports = authJWT;
