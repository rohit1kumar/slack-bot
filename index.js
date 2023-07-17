require('dotenv').config()
const db = require('./db')
const { registerEventHandlers, app, scheduleMessage } = require('./slack')
async function startSlackApp() {
	try {
		await db.connect()
		await app.start(process.env.PORT || 3000)
		console.log('⚡️ Bolt app is running!')
		registerEventHandlers()
		scheduleMessage()
	} catch (error) {
		console.error('Error starting Slack app', error)
	}
}

startSlackApp()
