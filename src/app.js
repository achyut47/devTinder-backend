const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');
const app = express();

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

//using the express js json middleware to convert any incoming request
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDb()
	.then(() => {
		console.log('database connection is succesful');
		app.listen(7777, () => {
			console.log('server is listening on port 7777....');
		});
	})
	.catch((err) => {
		console.log(err);
	});

// when you put a next() express expects
// a route handler so basically other route handlers
// are called as middlewares
