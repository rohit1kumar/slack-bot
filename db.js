const { MongoClient } = require('mongodb')

const MONGO_HOST = process.env.MONGO_HOST || 'localhost'
const MONGODB_URI = `mongodb://${MONGO_HOST}:27017`
const DB_NAME = process.env.MONGO_DB_NAME || 'slackbot'
const COLLECTION_NAME = 'channelDetails'

let dbClient
let channelDetailsCollection

const db = {
	connect: async function () {
		dbClient = await MongoClient.connect(MONGODB_URI, {
			useUnifiedTopology: true
		})
		console.log('Connected to MongoDB')
		channelDetailsCollection = dbClient.db(DB_NAME).collection(COLLECTION_NAME)
	},

	add: async function (channel, nextMessageTime) {
		return channelDetailsCollection.insertOne({
			channel,
			nextMessageTime
		})
	},

	remove: async function (channel) {
		return channelDetailsCollection.deleteOne({ channel })
	},

	update: async function (channel, nextMessageTime) {
		return channelDetailsCollection.updateOne(
			{ channel },
			{ $set: { nextMessageTime } }
		)
	},

	getAll: async function () {
		return channelDetailsCollection.find({}).toArray()
	}
}

module.exports = db
