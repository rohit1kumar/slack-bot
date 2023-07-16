require('dotenv').config()
const { App } = require('@slack/bolt')
const executeQuery = require('./query')

const BOT_ID = 'U05H8754KR9' // databot's user id, to prevent from responding to itself when joining a channel

const app = new App({
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	token: process.env.SLACK_BOT_TOKEN,
	// appToken: process.env.SLACK_APP_TOKEN,
	logLevel: 'debug'
})

app.event('app_mention', async ({ event, client }) => {
	const { channel, text } = event
	try {
		const userText = text.replace(/^<[^>]+>\s*/, '')
		const resp = await executeQuery(userText)
		await client.chat.postMessage({
			channel,
			text: resp || 'Sorry, I did not understand that. Please try again.'
		})
	} catch (error) {
		console.error(error)
	}
})

app.event('member_joined_channel', async ({ event, client }) => {
	let text
	const { user, channel } = event
	if (user === BOT_ID) {
		text = "I'm Databot and I can help you with your data needs"
	} else {
		text = `Welcome to the channel, <@${user}>, I'm Databot and I can help you with your data needs.`
	}

	try {
		await client.chat.postMessage({ channel, text })
	} catch (error) {
		console.error(error)
	}
})

;(async () => {
	try {
		// Start the app
		await app.start(process.env.PORT || 3000)
		console.log('⚡️ Bolt app is running!')
	} catch (error) {
		console.error('Error starting Bolt app:', error)
	}
})()
