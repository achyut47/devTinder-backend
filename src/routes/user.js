const express = require('express');

const userRouter = express.Router();

userRouter.use(express.json());
const User = require('../models/user');

const { userAuth } = require('../middlewares/auth');

const ConnectionRequest = require('../models/connectionRequest');

// get all the pending connection requests for the logged in user

const USER_SAFE_DATA = [
	'firstName',
	'lastName',
	'age',
	'gender',
	'about',
	'photoUrl',
	'skills',
];

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const connectionRequests = await ConnectionRequest.find({
			toUserId: loggedInUser._id,
			status: 'interested',
		}).populate('fromUserId', [
			'firstName',
			'lastName',
			'age',
			'gender',
			'about',
			'photoUrl',
			'skills',
		]);
		res.json({
			message: 'data fetched successfully',
			data: connectionRequests,
		});
	} catch (err) {
		res.status(400).send('Error: ' + err.message);
	}
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const connectionRequests = await ConnectionRequest.find({
			$or: [
				{
					toUserId: loggedInUser._id,
					status: 'accepted',
				},
				{
					fromUserId: loggedInUser._id,
					status: 'accepted',
				},
			],
		})
			.populate('fromUserId', USER_SAFE_DATA)
			.populate('toUserId', USER_SAFE_DATA);

		const data = connectionRequests.map((row) => {
			if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
				return row.toUserId;
			}
			return row.fromUserId;
		});

		res.json({
			message: 'connections fetched successfuly',
			data: data,
		});
	} catch (err) {
		res.status(400).send('Error: ' + err.message);
	}
});

// Feed Api

userRouter.get('/feed', userAuth, async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const loggedInUser = req.user;

		const connectionRequests = await ConnectionRequest.find({
			$or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
		}).select('fromUserId toUserId');

		const hideUsersFromFeed = new Set();
		connectionRequests.forEach((req) => {
			hideUsersFromFeed.add(req.fromUserId.toString());
			hideUsersFromFeed.add(req.toUserId.toString());
		});

		const users = await User.find({
			$and: [
				{ _id: { $nin: Array.from(hideUsersFromFeed) } },
				{ _id: { $ne: loggedInUser._id } },
			],
		})
			.select(USER_SAFE_DATA)
			.skip(skip)
			.limit(limit);

		res.send(users);
	} catch (err) {
		res.status(400).send('Error: ' + err.message);
	}
});

module.exports = userRouter;
