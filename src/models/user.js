const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			minLength: 4,
			maxLength: 36,
		},
		lastName: {
			type: String,
		},
		emailId: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validation(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid email address');
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new Error('enter a new password');
				}
			},
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			validate(value) {
				if (!['male', 'female', 'others'].includes(value)) {
					throw new Error('gender data is not valid');
				}
			},
		},
		photoUrl: {
			type: String,
			default: 'https://avatars.githubusercontent.com/u/68823462?v=4&size=64',

			validate(value) {
				if (!validator.isURL(value)) {
					throw new Error('invalid photo url');
				}
			},
		},
		about: {
			type: String,
			default: 'this  is a default description of the user!',
		},
		skills: {
			type: [String],
		},
	},
	{
		timestamps: true,
	},
);

userSchema.methods.getJWT = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id }, 'DEV@Tinder$790', {
		expiresIn: '7d',
	});

	return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
	const user = this;
	const passwordHash = user.password;

	const isPasswordValid = await bcrypt.compare(
		passwordInputByUser,
		passwordHash,
	);

	return isPasswordValid;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
