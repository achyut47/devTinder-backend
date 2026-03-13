const express = require('express');

const app = express();

app.get('/getUserData', (req, res) => {
	try {
		throw new Error('jkhsdgvb');
		res.send('user');
	} catch (err) {
		res.status(500).send('conact admin');
	}
});

app.use('/', (err, req, res, next) => {
	if (err) {
		res.status(500).send('something went wrong');
	}
});

app.listen(7777, () => {
	console.log('server is listening on port 7777');
});
// when you put a next() express expects
// a route handler so basically other route handlers
// are called as middlewares
