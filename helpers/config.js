"use strict";

const fs = require("fs");
const path = require("path");

function isRailway() {
	return Boolean(
		process.env.RAILWAY_PROJECT_ID
		|| process.env.RAILWAY_ENVIRONMENT
		|| process.env.RAILWAY_STATIC_URL
	);
}

function loadLocalConfig() {
	const p = path.resolve(__dirname, "..", "config.json");
	if (!isRailway() && fs.existsSync(p)) {
		const raw = fs.readFileSync(p, "utf8");
		return JSON.parse(raw);
	}
	return {};
}

const fileConfig = loadLocalConfig();

const config = {
	site: {
		port: parseInt(process.env.PW_SITE__PORT || fileConfig.site?.port || 5050, 10),
		name: process.env.PW_SITE__NAME || fileConfig.site?.name || "Paw Wars",
		secret: process.env.PW_SITE__SECRET || fileConfig.site?.secret || "",

		oauth: {
			host: process.env.PW_SITE__OAUTH__HOST || fileConfig.site?.oauth?.host || "",
			auth0: {
				domain: process.env.PW_SITE__OAUTH__AUTH0__DOMAIN
					|| fileConfig.site?.oauth?.auth0?.domain
					|| "",
				clientID: process.env.PW_SITE__OAUTH__AUTH0__CLIENT_ID
					|| fileConfig.site?.oauth?.auth0?.clientID
					|| "",
				clientSecret: process.env.PW_SITE__OAUTH__AUTH0__CLIENT_SECRET
					|| fileConfig.site?.oauth?.auth0?.clientSecret
					|| ""
			}
		},

		analytics: process.env.PW_SITE__ANALYTICS
			|| fileConfig.site?.analytics
			|| "",

		db: {
			host: process.env.PW_SITE__DB__HOST || fileConfig.site?.db?.host || "localhost",
			port: parseInt(process.env.PW_SITE__DB__PORT || fileConfig.site?.db?.port || 27017, 10),
			name: process.env.PW_SITE__DB__NAME || fileConfig.site?.db?.name || "",
			user: process.env.PW_SITE__DB__USER || fileConfig.site?.db?.user || "",
			password: process.env.PW_SITE__DB__PASSWORD || fileConfig.site?.db?.password || ""
		}
	}
};

module.exports = config;
