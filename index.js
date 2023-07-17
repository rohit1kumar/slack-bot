require('dotenv').config()
const { connectToMongoDB } = require('./db')
const { registerEventHandlers, app, scheduleMessage } = require('./slack')
async function startSlackApp() {
	try {
		await connectToMongoDB()
		await app.start(process.env.PORT || 3000)
		console.log('⚡️ Bolt app is running!')
		registerEventHandlers()
		scheduleMessage()
	} catch (error) {
		console.error('Error starting Slack app', error)
	}
}

startSlackApp()
