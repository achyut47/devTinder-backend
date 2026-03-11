const express = require('express');

const app = express();

app.use('/hello', (req, res) => {
	res.send('hello world');
});

app.use('/', (req, res) => {
	res.send('welcome');
});

app.listen(8888, () => {
	console.log('server is listening on port 8888....');
});
