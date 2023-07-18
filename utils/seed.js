const fs = require('fs/promises')
const sqlite3 = require('sqlite3').verbose()

const dbFile = './utils/user.db'

fs.readFile('utils/seed.sql', 'utf8')
	.then((data) => {
		const sqlFile = data

		const db = new sqlite3.Database(dbFile, (err) => {
			if (err) {
				console.error('Error opening the database:', err.message)
				return
			}

			console.log('Connected to the database.')

			// Execute the SQL commands from the file
			db.exec(sqlFile, (err) => {
				if (err) {
					console.error('Error executing SQL file:', err.message)
				} else {
					console.log('Database seeded successfully.')
				}

				// Close the database connection
				db.close((err) => {
					if (err) {
						console.error('Error closing the database:', err.message)
					} else {
						console.log('Database connection closed.')
					}
				})
			})
		})
	})
	.catch((err) => {
		console.error('Error reading the SQL file:', err.message)
	})
