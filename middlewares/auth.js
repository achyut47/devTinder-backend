const adminAuth = (req, res, next) => {
	console.log('admin auth is getting checked');
	const token = 'xyz';
	const isAuthorized = token === 'xyz';

	if (!isAuthorized) {
		res.status(401).send('admin not authorized');
	} else {
		next();
	}
};

const userAuth = (req, res, next) => {
	console.log('User auth is getting checked');
	const token = 'xy';
	const isAuthorized = token === 'xyz';

	if (!isAuthorized) {
		res.status(401).send('user not authorized');
	} else {
		next();
	}
};

module.exports = {
	adminAuth,
	userAuth,
};
