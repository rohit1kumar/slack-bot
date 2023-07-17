const { App } = require('@slack/bolt')
const executeQuery = require('./query')
const { WebClient } = require('@slack/web-api')
const {
	insertChannelDetails,
	deleteChannelDetails,
	updateNextMessageTime,
	getChannelDetails
} = require('./db')

let BOT_ID

const TIME_INTERVAL = 3600000 // 60 minutes in milliseconds

const app = new App({
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	token: process.env.SLACK_BOT_TOKEN
})

const client = new WebClient(process.env.SLACK_BOT_TOKEN)

function registerEventHandlers() {
	app.event('app_mention', handleAppMention)
	app.event('member_joined_channel', handleMemberJoinedChannel)
	app.event('channel_left', handleChannelLeft)
}

async function postMessageToChannel(channel, message) {
	return client.chat.postMessage({
		channel,
		text: message
	})
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
	if (!BOT_ID) {
		const resp = await client.auth.test()
		BOT_ID = resp.user_id
	}

	console.log('BOT ID: ', BOT_ID)
	const isBotUser = user === BOT_ID
	const welcomeMessage = isBotUser
		? "I'm Databot and I can help you with your data needs"
		: `Welcome to the channel, <@${user}>, I'm Databot and I can help you with your data needs.`
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

async function scheduleMessage() {
	setInterval(async () => {
		const currentTime = new Date()
		try {
			const channelDetails = await getChannelDetails()
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

module.exports = { scheduleMessage, registerEventHandlers, app }
