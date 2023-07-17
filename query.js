const sqlite3 = require('sqlite3').verbose()
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const db = new sqlite3.Database(':memory:')

db.serialize(() => {
	db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY,
      android_manufacturer TEXT,
      android_model TEXT,
      android_os_version TEXT,
      android_app_version TEXT,
      acquisition_campaign TEXT,
      acquisition_source TEXT,
      city TEXT,
      state TEXT,
      onboarding_time DATETIME,
      phone_carrier TEXT,
      phone_screen_dpi INTEGER,
      phone_screen_height INTEGER,
      phone_screen_width INTEGER,
      name TEXT,
      age INTEGER
    )
  `)
})

async function generateSQLQuery(question) {
	const messages = [
		{
			role: 'system',
			content:
				'Given the following SQL table, your job is to write queries given a user’s request.'
		},
		{
			role: 'user',
			content:
				'CREATE TABLE user (id INTEGER PRIMARY KEY, android_manufacturer TEXT, android_model TEXT, android_os_version TEXT, android_app_version TEXT, acquisition_campaign TEXT, acquisition_source TEXT, city TEXT, state TEXT, onboarding_time DATETIME, phone_carrier TEXT, phone_screen_dpi INTEGER, phone_screen_height INTEGER, phone_screen_width INTEGER, name TEXT, age INTEGER);'
		},
		{
			role: 'user',
			content: question
		}
	]

	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages,
		temperature: 0,
		max_tokens: 1024,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0
	})

	const generatedQuery = response?.data?.choices[0]?.message?.content
	return generatedQuery
}

async function executeQuery(query) {
	const response = await generateSQLQuery(query)
	const rows = await new Promise((resolve, reject) => {
		db.all(response, (err, rows) => {
			if (err) {
				reject(err)
			} else {
				resolve(rows)
			}
		})
	})

	const count = Object.values(rows[0])[0]
	const resp = `There are ${count} users.`
	return resp
}

module.exports = executeQuery
