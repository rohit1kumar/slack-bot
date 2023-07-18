const channelDetails = require('../../database/storeChannel')

let BOT_ID
const TIME_INTERVAL = 3600000 // 60 minutes

/**
 * When memeber joins a channel, this callback is called,
 * we welcome the user (except bot user) and schedule next
 *  message asking if they need any help after 60 minutes
 */

async function memberJoinedChannelCallback({ client, event }) {
	const { user, channel, event_ts, team } = event

	/**finding bot user id to prevent bot from welcoming itself */
	if (!BOT_ID) {
		const resp = await client.auth.test()
		BOT_ID = resp.user_id
	}

	let text
	if (user === BOT_ID) {
		text = "I'm Databot and I can help you with your data needs"
	} else {
		text = `Welcome to the channel, <@${user}>, I'm Databot and I can help you with your data needs.`
	}

	const addedTime = new Date(parseFloat(event_ts) * 1000)
	const nextMessageTime = new Date(addedTime.getTime() + TIME_INTERVAL) // for scheduling next message

	try {
		await Promise.all([
			channelDetails.saveChannel(channel, nextMessageTime, team),
			client.chat.postMessage({ channel, text })
		])
	} catch (error) {
		console.error(error)
	}
}

module.exports = { memberJoinedChannelCallback }
