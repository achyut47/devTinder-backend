const express = require('express');

const app = express();

app.use('/test', (req, res) => {
	res.send('this is a test');
});

//use matches all the http method apis
app.use('/user', (req, res) => {
	res.send('heyhyehye');
});

app.get('/user', (req, res) => {
	res.send('making a get call to user');
});

app.post('/user', (req, res) => {
	res.send('data succesfully saved in the database');
});

app.delete('/user', (req, res) => {
	res.send('user deleted');
});

app.listen(7777, () => {
	console.log('server is listening on port 7777....');
});
