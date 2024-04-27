// src/app.js
const express = require('express');
const app = express();
const apiRoutes = require('./src/routes')

// const apiRoutes = require('./routes/api');

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res ) => {
    res.send('Welcome to Anakin IRCTC server!');
});

app.use('/api', apiRoutes );

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
