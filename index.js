const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('morgan');
const app = express();
app.use(helmet());
require('dotenv').config();
const compression = require('compression');
const port = process.env.PORT || 5000;

// setup middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(logger('combined'));

// connect to the database
const mongoDB = process.env.ATLAS_URI;
mongoose
	.connect(mongoDB, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
	})
	.then(() => console.log('Connected to Database'))
	.catch((err) => console.error('An error has occured', err));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// routes
const address_verification_router = require('./routes/address_verification.route');
const agent_router = require('./routes/agent.route');
const credit_report_router = require('./routes/creditreport.route');
const identity_router = require('./routes/identity.route');
const staff_router = require('./routes/staff.route');
const user_router = require('./routes/user.route');

// middleware
app.use('/api/v1/user', user_router);
app.use('/api/v1/agent', agent_router);
app.use('/api/v1/credit', credit_report_router);
app.use('/api/v1/identity', identity_router);
app.use('/api/v1/staff', staff_router);
app.use('/api/v1/address/', address_verification_router);

// testing
app.get('/', (req, res) => {
	res.send('Welcome to this api.');
});

app.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});
