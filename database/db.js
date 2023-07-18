const mongoose = require('mongoose')
require('dotenv').config()

const MONGO_HOST = process.env.MONGO_HOST || 'localhost'
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'slackbot'
const uri = `mongodb://${MONGO_HOST}:27017/${MONGO_DB_NAME}`

const connect = async function () {
	mongoose.connect(uri)
}

// for storing workspace auth details
const usersSchema = mongoose.Schema(
	{
		_id: String,
		team: { id: String, name: String },
		enterprise: { id: String, name: String },
		user: { token: String, scopes: [String], id: String },
		tokenType: String,
		isEnterpriseInstall: Boolean,
		appId: String,
		authVersion: String,
		bot: {
			scopes: [String],
			token: String,
			userId: String,
			id: String
		}
	},
	{ _id: false }
)

const User = mongoose.model('User', usersSchema)

// For Storing Channel Details for scheduling messages
const channelSchema = new mongoose.Schema({
	_id: String,
	channel: String,
	nextMessageTime: Date,
	team: String
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = {
	User,
	connect,
	Channel
}
