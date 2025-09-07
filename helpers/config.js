"use strict";

const fs = require("fs");
const path = require("path");
const common = require("./common");

function isValidRedisUrl(url) {
	if (!url || typeof url !== "string") { return false; }
	return url.startsWith("redis://") || url.startsWith("rediss://");
}

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

function isProduction() {
	return process.env.NODE_ENV === "production" || isRailway();
}

const config = {
	site: {
		port: parseInt(process.env.PW_SITE__PORT || fileConfig.site?.port || 5050, 10),
		name: process.env.PW_SITE__NAME || fileConfig.site?.name || "Paw Wars",
		secret: process.env.PW_SITE__SECRET || fileConfig.site?.secret || "",
		// Redis connection string for production session store
		// Prefer REDIS_URL if provided by hosting platform
		redis_url: process.env.REDIS_URL || fileConfig.site?.redis_url || "",

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
			host: process.env.MONGOHOST || fileConfig.site?.db?.host || "localhost",
			port: parseInt(process.env.MONGOPORT || fileConfig.site?.db?.port || 27017, 10),
			name: process.env.PW_SITE__DB__NAME || fileConfig.site?.db?.name || "PawWars",
			user: process.env.MONGOUSER || fileConfig.site?.db?.user || "",
			password: process.env.MONGOPASSWORD || fileConfig.site?.db?.password || ""
		}
	}
};

// Provide a session store, selecting Redis in production when available,
// otherwise falling back to the in-memory store.
config.getSessionStore = function getSessionStore() {
	const memoryStore = require("./session_store");
	const useRedis = isProduction() && isValidRedisUrl(config.site.redis_url);
	if (!useRedis) {
		common.log("info", "Session store: in-memory");
		return memoryStore;
	}
	try {
		const koaRedis = require("koa-redis");
		const store = koaRedis({
			url: config.site.redis_url,
			connectTimeout: 5000,
			retryStrategy: (times) => Math.min(times * 200, 2000)
		});
		common.log("info", "Session store: redis", process.env.REDISHOST);
		return store;
	} catch (err) {
		common.log("warn", `Redis session store unavailable, using memory store: ${err.message}`);
		return memoryStore;
	}
};

module.exports = config;
