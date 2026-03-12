const express = require('express');

const app = express();

app.use('/user', [
	(req, res, next) => {
		console.log('handling the route user');
		res.send('response');
		next();
	},
	(req, res, next) => {
		//res.send('2nd response!!');
		next();
	},
	(req, res) => {
		res.send('3rd response!!');
	},
	(req, res) => {
		res.send('4th res!');
	},
]);

app.listen('7777', () => {
	console.log('server listening on port 7777....');
});
