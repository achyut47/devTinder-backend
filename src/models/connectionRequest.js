const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},

		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		status: {
			type: String,
			required: true,
			enum: {
				values: ['ignored', 'interested', 'accepted', 'rejected'],
				message: `{VALUE} is incorrect status type`,
			},
		},
	},
	{
		timestamps: true,
	},
);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save', function () {
	const connectionRequest = this;

	// check if from and to user id are same
	if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
		throw new Error('fromUserId and toUserId cannot be the same');
	}
});

const ConnectionRequestModel = new mongoose.model(
	'ConnectionRequest',
	connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
