const channelDetails = require('../../database/storeChannel')
/**
 * When bot is removed from a channel, this callback is called,
 * we delete the channel from database to stop scheduling messages
 */
async function channelLeftCallback({ event }) {
	const { channel } = event
	try {
		await channelDetails.deleteChannel(channel)
	} catch (error) {
		console.error(error)
	}
}

module.exports = { channelLeftCallback }
