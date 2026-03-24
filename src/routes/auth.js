//creating a router using express
const { validateSignUpData } = require('../utils/validation');

const express = require('express');

const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
	try {
		const { emailId, password } = req.body;

		const user = await User.findOne({ emailId: emailId });

		if (!user) {
			throw new Error('user is not present in the db');
		}

		const isPasswordValid = await user.validatePassword(password);
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

authRouter.post('/logout', async (req, res) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
	});

	res.send('logout successful');
});

module.exports = authRouter;
