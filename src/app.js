const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');
const app = express();
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('./utils/validation');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');
//using the express js json middleware to convert any incoming request
app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
	// validation of  data
	try {
		validateSignUpData(req);

		const { firstName, lastName, emailId, password } = req.body;
		//encrypt password
		const passwordHash = await bcrypt.hash(password, 10);
		console.log(passwordHash);
		//console.log(req.body);

		const user = new User({
			firstName,
			lastName,
			emailId,
			password: passwordHash,
		});

		await user.save();
		res.send('user has been added successfully');
	} catch (err) {
		res.status(400).send('something went wrong: ' + err.message);
	}
});

app.post('/login', async (req, res) => {
	try {
		const { emailId, password } = req.body;

		const user = await User.findOne({ emailId: emailId });

		if (!user) {
			throw new Error('user is not present in the db');
		}

		const isPasswordValid = await validatePassword(password);
		if (isPasswordValid) {
			//create a jwt token for the user
			const token = await user.getJWT();
			console.log(token);
			//add the token to a cookie and send the response back
			res.cookie('token', token, {
				expires: new Date(Date.now() + 8 * 3600000),
			});
			res.send('login successful');
		} else {
			throw new Error('login not successful!');
		}
	} catch (err) {
		res.status(400).send('error: ' + err.message);
	}
});

app.get('/profile', userAuth, async (req, res) => {
	try {
		const user = req.user;

		res.send(user);
	} catch (err) {
		res.status(400).send('error:  ' + err.message);
	}
});

app.post('/sentConnectionRequest', userAuth, async (req, res) => {
	const user = req.user;

	console.log('sending a connection request');

	res.send(user.firstName + ' sent the connection request');
});

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
