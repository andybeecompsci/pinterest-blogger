// express server configuration
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// load environment variables
dotenv.config();

// import routes
const trendsRoutes = require('./src/routes/trendsRoutes');

// initialize express app
const app = express();

// middleware setup
app.use(cors());
app.use(express.json());

// basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// routes
app.use('/api', trendsRoutes);

// define port
const PORT = process.env.PORT || 3001;

// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 