require('dotenv').config()
const sqlite3 = require('sqlite3').verbose()
const { Configuration, OpenAIApi } = require('openai')
// Configure the OpenAI API
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

// Create db if it doesn't exist
const db = new sqlite3.Database('')

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

function executeQuery(query) {
	return new Promise((resolve, reject) => {
		generateSQLQuery(query)
			.then((response) => {
				db.all(response, (err, rows) => {
					if (err) {
						reject(err)
					} else {
						const count = Object.values(rows[0])[0]
						const resp = `There are ${count} users.`
						resolve(resp)
					}
				})
			})
			.catch((error) => {
				reject(error)
			})
	})
}

// executeQuery("How many users joined yesterday?")
//     .then(resp => console.log(resp))
//     .catch(err => console.log(err));

module.exports = executeQuery
