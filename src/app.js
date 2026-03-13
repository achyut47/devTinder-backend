const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');
const app = express();

app.post('/signup', async (req, res) => {
	const userObj = {
		firstName: 'rajni',
		lastName: 'ganda',
		emailId: 'rajni@panda.com',
		password: 'raja@123',
	};
	// creating a new instance of the user model
	const user = new User(userObj);

	try {
		await user.save();
		res.send('user added succesfully');
	} catch (err) {
		res.status(400).send('error saving the user:' + err.message);
	}
});

connectDb()
	.then(() => {
		console.log('database connection established successfully');
		app.listen(7777, () => {
			console.log('server is listening on port 7777');
		});
	})
	.catch((err) => {
		console.error('not successfully connected to database', err);
	});

// when you put a next() express expects
// a route handler so basically other route handlers
// are called as middlewares
