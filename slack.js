const { App } = require('@slack/bolt')
require('dotenv').config()
const executeQuery = require('./query.js')

const app = new App({
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	token: process.env.SLACK_BOT_TOKEN,
	appToken: process.env.SLACK_APP_TOKEN,
	socketMode: true
})

app.command('/ask', async ({ command, ack, say }) => {
	try {
		await ack()
		const resp = await executeQuery(`${command.text}`)
		console.log('resp from slack', command.text)
		console.log('resp from bot', resp)
		await say(resp || 'Sorry, I did not understand that. Please try again.')
	} catch (error) {
		console.error(error)
		await say(
			'Sorry, I did not understand that. Please try again, or contact the developer.'
		)
	}
})

;(async () => {
	// Start the app
	await app.start(process.env.PORT || 3000)

	console.log('⚡️ Bolt app is running!')
})()
