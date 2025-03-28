const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(morgan('dev')); // Logs incoming requests
app.use(cors()); // Enables CORS
app.use(express.json()); // Parses JSON bodies

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

