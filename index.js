// index.js
const { startSlackApp } = require('./slack')

;(async () => {
	try {
		await startSlackApp()
	} catch (error) {
		console.error('Error starting the app:', error)
	}
})()
