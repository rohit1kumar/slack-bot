const model = require('../db')

const find = async (id) => {
	try {
		const user = await model.User.find({ _id: id })
		if (user[0] !== undefined) {
			return user[0]
		}
	} catch (error) {
		console.error(error)
	}
	return false
}

module.exports = {
	find
}
