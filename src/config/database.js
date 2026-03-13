const mongoose = require('mongoose');

const connectDb = async () => {
	await mongoose.connect(
		'mongodb+srv://namastedev:namastedev@namastenode.sh75hs7.mongodb.net/devTinder',
	);
};

module.exports = connectDb;
