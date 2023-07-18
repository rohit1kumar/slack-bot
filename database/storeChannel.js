const model = require('./db')

/**
 * Save channel details to database to schedule next message
 */

const saveChannel = async (channel, nextMessageTime, team) => {
	try {
		const resp = await model.Channel.updateOne(
			{ _id: channel },
			{
				channel,
				nextMessageTime,
				team
			},
			{ upsert: true }
		)
		return resp
	} catch (error) {
		console.error(error)
		return error
	}
}

const getAllChannels = async () => {
	try {
		const resp = await model.Channel.find({})
		return resp
	} catch (error) {
		console.error(error)
		return error
	}
}

const deleteChannel = async (channel) => {
	try {
		const resp = await model.Channel.deleteOne({ channel })
		return resp
	} catch (error) {
		console.error(error)
		return error
	}
}

module.exports = { saveChannel, getAllChannels, deleteChannel }
