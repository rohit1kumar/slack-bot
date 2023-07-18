require('dotenv').config()

const { App, LogLevel } = require('@slack/bolt')

const { registerListeners } = require('./listeners')
const db = require('./database/db')
const workspaceAuth = require('./database/workspaceAuth')
const chat = require('./utils/chat')

const app = new App({
	logLevel: LogLevel.DEBUG,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	clientId: process.env.SLACK_CLIENT_ID,
	clientSecret: process.env.SLACK_CLIENT_SECRET,
	stateSecret: process.env.SLACK_STATE_SECRET,
	installerOptions: {
		stateVerification: true
	},
	scopes: [
		'app_mentions:read',
		'chat:write',
		'channels:join',
		'channels:read',
		'groups:read'
	],
	installationStore: {
		storeInstallation: async (installation) => {
			if (installation.team !== undefined) {
				return workspaceAuth.add(installation)
			}
			throw new Error('Failed saving installation data to installationStore')
		},
		fetchInstallation: async (installQuery) => {
			if (installQuery.teamId !== undefined) {
				return workspaceAuth.find(installQuery.teamId)
			}
			throw new Error('Failed fetching installation')
		}
	}
})

/** Register Listeners */
registerListeners(app)

/** Start Bolt App */
;(async () => {
	try {
		await app.start(process.env.PORT || 3000)
		console.log('⚡️ Bolt app is running! ⚡️')
		db.connect()
		console.log('DB is connected.')
		await chat.scheduleMessage()
	} catch (error) {
		console.error('Unable to start App', error)
	}
})()
