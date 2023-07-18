const sqlite3 = require('sqlite3').verbose()
const { generateSQLQuery } = require('./generateSQLQuery')
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

async function executeSQLQuery(query) {
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

module.exports = executeSQLQuery
