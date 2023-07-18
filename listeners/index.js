const events = require('./events')

module.exports.registerListeners = (app) => {
	events.register(app)
}
