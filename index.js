// src/app.js
const express = require('express');
const app = express();
const { specs, swaggerUi } = require("./swagger");
const logger = require("morgan");
const apiRoutes = require('./src/routes')

// const apiRoutes = require('./routes/api');

// Middleware
app.use(logger("dev"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res ) => {
    res.send('Welcome to Anakin IRCTC server!');
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)); 
app.use('/api', apiRoutes );

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
