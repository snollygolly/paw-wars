"use strict";

const passport = require("../index.js").passport;
const config = require("../helpers/config");
const playerModel = require("./game_player");
const lifeModel = require("./game_life");

// if we have a port other than 80 AND we are running it locally, add it to our callback url
// otherwise, don't attach a port (accounts for nginx on prod)
let port = "";
if (config.site.port !== 80 && config.site.oauth.host.indexOf("127.0.0.1") > -1) {
	port = `:${config.site.port}`;
}

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

const Auth0Strategy = require("passport-auth0");

passport.use(new Auth0Strategy({
	domain: config.site.oauth.auth0.domain,
	clientID: config.site.oauth.auth0.clientID,
	clientSecret: config.site.oauth.auth0.clientSecret,
	callbackURL: `${config.site.oauth.host}${port}/auth/auth0/callback`
}, async(accessToken, refreshToken, extraParams, profile, done) => {
	let player = await playerModel.getPlayer(profile.id);
	if (player === null) {
		// create them
		player = playerModel.convertProfile(profile);
		await playerModel.createPlayer(player);
	}
	done(null, player);
}));
