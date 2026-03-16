const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');
const app = express();

//using the express js json middleware to convert any incoming request
app.use(express.json());
app.post('/signup', async (req, res) => {
	//console.log(req.body);
	const userObj = req.body;

	const user = new User(userObj);

	try {
		await user.save();
		res.send('user has been added successfully');
	} catch (err) {
		res.status(400).send('something went wrong', err.message);
	}
});

app.get('/user', async (req, res) => {
	const userEmail = req.body.emailId;
	try {
		const user = await User.findOne({ emailId: userEmail });
		if (!user) {
			res.status(404).send('user not found');
		} else {
			res.send(user);
		}
	} catch (err) {
		res.status(400).send('not found');
	}

	// try {
	// 	const users = await User.find({ emailId: userEmail });
	// 	if (users.length === 0) {
	// 		res.status(404).send('user not found');
	// 	} else {
	// 		res.send(users);
	// 	}
	// } catch (err) {
	// 	res.status(400).send('something went wrong!!');
	// }
});

//feed Api

app.get('/feed', async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (err) {
		res.status(400).send('something went wrong');
	}
});

app.get('/findById', async (req, res) => {
	const id = req.body?._id;

	try {
		const user = await User.findById({ _id: id });
		if (!user) {
			res.status(404).send('user not found');
		} else {
			res.send(ans);
		}
	} catch (err) {
		res.status(400).send('soomething wenrt wrong');
	}
});

// deleting  a  user
app.delete('/user', async (req, res) => {
	const userId = req.body.userId;

	try {
		const user = await User.findByIdAndDelete({ _id: userId });
		res.send('user deleted successfully');
	} catch (err) {
		res.status(400).send('something went wrong');
	}
});

// update user
app.patch('/user', async (req, res) => {
	const userId = req.body.userId;
	const data = req.body;

	try {
		await User.findByIdAndUpdate({ _id: userId }, data, {
			returnDocument: 'after',
			runValidators: true,
		});
		res.send('user updated successfully');
	} catch (err) {
		res.status(400).send('update failed: ' + err.message);
	}
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
