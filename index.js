
const express = require("express");
const app = express();
const { specs, swaggerUi } = require("./swagger");
const logger = require("morgan");
const cors = require("cors");
const apiRoutes = require("./src/routes");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

// Routes
app.get("/", (req, res) => {
  res.send({ success: true, message: "Welcome to Anakin IRCTC server!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
