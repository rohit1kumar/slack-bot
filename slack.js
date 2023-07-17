// app.js
const { App } = require('@slack/bolt')
const executeQuery = require('./query')
const { WebClient } = require('@slack/web-api')
const { MongoClient } = require('mongodb')

const BOT_ID = 'U05H8754KR9' // Databot's user ID
const MONGO_HOST = process.env.MONGO_HOST || 'localhost'

const MONGODB_URI = `mongodb://${MONGO_HOST}:27017`

const DB_NAME = process.env.MONGO_DB_NAME || 'slackbot'
const COLLECTION_NAME = 'channelDetails'
const TIME_INTERVAL = 3600000 // 60 minutes in milliseconds

const app = new App({
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	token: process.env.SLACK_BOT_TOKEN
})

const client = new WebClient(process.env.SLACK_BOT_TOKEN)

let dbClient
let channelDetailsCollection

async function startSlackApp() {
	await connectToMongoDB()
	registerEventHandlers()
	await app.start(process.env.PORT || 3000)
	console.log('⚡️ Bolt app is running!')
	scheduleMessageSending()
}

async function connectToMongoDB() {
	dbClient = await MongoClient.connect(MONGODB_URI, {
		useUnifiedTopology: true
	})
	console.log('Connected to MongoDB')
	const db = dbClient.db(DB_NAME)
	channelDetailsCollection = db.collection(COLLECTION_NAME)
}

function registerEventHandlers() {
	app.event('app_mention', handleAppMention)
	app.event('member_joined_channel', handleMemberJoinedChannel)
	app.event('channel_left', handleChannelLeft)
}

function postMessageToChannel(channel, message) {
	return client.chat.postMessage({
		channel,
		text: message
	})
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

async function handleAppMention({ event }) {
	const { channel, text } = event
	try {
		const userText = text.replace(/^<[^>]+>\s*/, '')
		const resp = await executeQuery(userText)
		const message =
			resp || 'Sorry, I did not understand that. Please try again.'
		await postMessageToChannel(channel, message)
	} catch (error) {
		console.error(error)
	}
}

async function handleMemberJoinedChannel({ event }) {
	const { user, channel, event_ts } = event
	const isBotUser = user === BOT_ID
	const welcomeMessage = isBotUser
		? "I'm Databot and I can help you with your data needs"
		: `Welcome to the channel, <@${user}>, I'm Databot and I can help you with your data needs.`
	console.log(event_ts)
	const addedTime = new Date(parseFloat(event_ts) * 1000)
	const nextMessageTime = new Date(addedTime.getTime() + TIME_INTERVAL)

	try {
		await Promise.all([
			insertChannelDetails(channel, nextMessageTime),
			postMessageToChannel(channel, welcomeMessage)
		])
	} catch (error) {
		console.error(error)
	}
}

async function handleChannelLeft({ event }) {
	const { channel } = event
	try {
		await deleteChannelDetails(channel)
	} catch (error) {
		console.error(error)
	}
}

async function scheduleMessageSending() {
	setInterval(async () => {
		const currentTime = new Date()

		try {
			const channelDetails = await channelDetailsCollection.find({}).toArray()

			for (const { channel, nextMessageTime } of channelDetails) {
				if (currentTime >= nextMessageTime) {
					await postMessageToChannel(channel, 'Do you have any questions?')
					const updatedNextMessageTime = new Date(
						nextMessageTime.getTime() + TIME_INTERVAL
					)
					await updateNextMessageTime(channel, updatedNextMessageTime)
				}
			}
		} catch (error) {
			console.error(error)
		}
	}, 60000)
}

module.exports = { startSlackApp }
