const executeSQLQuery = require('../../utils/executeSQLQuery')
/**
 * When bot is mentioned, this callback is called,
 * we will make a SQL query and Execute it to get the result
 * and post it back to the channel
 */
const appMentionCallback = async ({ client, event }) => {
	const { text } = event
	try {
		const response = await executeSQLQuery(text)
		await client.chat.postMessage({
			channel: event.channel,
			text: `Hi <@${event.user}>! ${response}`
		})
	} catch (error) {
		console.error(error)
		await client.chat.postMessage({
			channel: event.channel,
			text: `Hi <@${event.user}>! Something went wrong, please try again, if the issue persists, Please contact the developer`
		})
	}
}

module.exports = { appMentionCallback }
