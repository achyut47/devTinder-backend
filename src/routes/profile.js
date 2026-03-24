const express = require('express');

const validator = require('validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

profileRouter.use(express.json());

profileRouter.get('/profile/view', userAuth, async (req, res) => {
	try {
		const user = req.user;

		res.send(user);
	} catch (err) {
		res.status(400).send('error:  ' + err.message);
	}
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
	try {
		if (!validateEditProfileData(req)) {
			throw new Error('invalid edit request');
		}

		const loggedInUser = req.user;

		Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

		res.json({
			message: `${loggedInUser.firstName}, your profile is updated`,
			data: loggedInUser,
		});

		await loggedInUser.save();
	} catch (err) {
		res.status(400).send('error: ' + err.message);
	}
});

//patch password api (forgot password api)
// validate all data when using apis

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
	try {
		const { password } = req.body;

		//valudate new password using validator
		if (!validator.isStrongPassword(password)) {
			throw new Error('enter a stronger password');
		}

		const loggedInUser = req.user;

		const isSamePassword = await loggedInUser.validatePassword(password);

		if (isSamePassword) {
			throw new Error('use a  different password');
		}
		loggedInUser.password = await bcrypt.hash(password, 10);
		await loggedInUser.save();

		res.send('password updated successfully');
	} catch (err) {
		res.status(400).send('Error: ' + err.message);
	}
});

module.exports = profileRouter;
