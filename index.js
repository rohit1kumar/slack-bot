// index.js
const { startSlackApp } = require('./slack')

;(async () => {
	try {
		console.log('Starting the app...')
		await startSlackApp()
	} catch (error) {
		console.error('Error starting the app:', error)
	}
})()
