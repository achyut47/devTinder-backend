const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuth = async (req, res, next) => {
	try {
		// read the token from the req cookies
		const cookies = req.cookies;

		// validate the token
		const { token } = cookies;

		if (!token) {
			throw new Error('token is  not valid!');
		}
		const decodedObj = await jwt.verify(token, 'DEV@Tinder$790');

		const { _id } = decodedObj;

		//find the user

		const user = await User.findById(_id);
		if (!user) {
			throw new Error('user not found');
		}
		req.user = user;
		next();
	} catch (err) {
		res.status(404).send('ERROR: ' + err.message);
	}
};

module.exports = {
	userAuth,
};
