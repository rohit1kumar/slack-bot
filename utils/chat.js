const { WebClient } = require('@slack/web-api')

const channelDetails = require('../database/storeChannel')
const workspaceAuth = require('../database/workspaceAuth')

const TIME_INTERVAL = 3600000 // 60 minutes in milliseconds

async function scheduleMessage() {
	setInterval(async () => {
		const currentTime = new Date()
		try {
			const allChannelDetails = await channelDetails.getAllChannels()
			for (const { channel, nextMessageTime, team } of allChannelDetails) {
				if (currentTime >= nextMessageTime) {
					const text = 'Do you have any questions?'
					const workspace = await workspaceAuth.find(team)
					const client = new WebClient(workspace.bot.token)
					await client.chat.postMessage({ channel, text })
					const updatedNextMessageTime = new Date(
						nextMessageTime.getTime() + TIME_INTERVAL
					)
					await channelDetails.saveChannel(channel, updatedNextMessageTime)
				}
			}
		} catch (error) {
			console.error(error)
		}
	}, 60000) // 1 minute in milliseconds
}

// async function sendMessage(channel, text, team) {
//     return client.chat.postMessage({ channel, text })
// }

module.exports = { scheduleMessage }
