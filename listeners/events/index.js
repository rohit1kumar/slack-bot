const { appMentionCallback } = require('./appMention')
const { memberJoinedChannelCallback } = require('./memberJoinedChannel')
const { channelLeftCallback } = require('./channelLeft')

module.exports.register = (app) => {
	app.event('app_mention', appMentionCallback)
	app.event('member_joined_channel', memberJoinedChannelCallback)
	app.event('channel_left', channelLeftCallback)
}
