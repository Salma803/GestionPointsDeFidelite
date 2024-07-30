/** @type {import('pm2').Config} */

module.exports = {
	apps: [
		{
			name: "salma-project-client",
			script: "cd client && npm run start && cd ../",
		},
		{
			name: "salma-project-server",
			script: "cd server && npm run start && cd ../",
		},
	],
};
