require('module-alias/register');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('@config/db');
const { notFound, errorHandler } = require('@middleware/errorMiddleware');
const apiRoutes = require('@routes/apis');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Admin Backend API running');
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`)
});
