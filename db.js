const { MongoClient } = require('mongodb')

const MONGO_HOST = process.env.MONGO_HOST || 'localhost'
const MONGODB_URI = `mongodb://${MONGO_HOST}:27017`
const DB_NAME = process.env.MONGO_DB_NAME || 'slackbot'
const COLLECTION_NAME = 'channelDetails'

let dbClient
let channelDetailsCollection

async function connectToMongoDB() {
	dbClient = await MongoClient.connect(MONGODB_URI, {
		useUnifiedTopology: true
	})
	console.log('Connected to MongoDB')
	const db = dbClient.db(DB_NAME)
	channelDetailsCollection = db.collection(COLLECTION_NAME)
}

async function insertChannelDetails(channel, nextMessageTime) {
	return channelDetailsCollection.insertOne({
		channel,
		nextMessageTime
	})
}

async function deleteChannelDetails(channel) {
	console.log(`Removed from channel ${channel}, deleting details from MongoDB`)
	return channelDetailsCollection.deleteOne({ channel })
}
async function updateNextMessageTime(channel, nextMessageTime) {
	return channelDetailsCollection.updateOne(
		{ channel },
		{ $set: { nextMessageTime } }
	)
}

async function getChannelDetails() {
	return channelDetailsCollection.find({}).toArray()
}

module.exports = {
	connectToMongoDB,
	insertChannelDetails,
	deleteChannelDetails,
	updateNextMessageTime,
	getChannelDetails
}
