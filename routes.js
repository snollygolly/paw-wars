"use strict";

const config = require("./config.json");

const app = require("./index.js").app;
const passport = require("./index.js").passport;
const Router = require("koa-router");

const routes = new Router();

const main = require("./controllers/main.js");
const manual = require("./controllers/manual.js");

const game_hotel = require("./controllers/game_hotel.js");
const game_bank = require("./controllers/game_bank.js");
const game_vendors = require("./controllers/game_vendors.js");
const game_market = require("./controllers/game_market.js");
const game_airport = require("./controllers/game_airport.js");
const game_police = require("./controllers/game_police.js");
const game_storage = require("./controllers/game_storage.js");
const game_life = require("./controllers/game_life.js");

// app routes
routes.get("/", main.index);
routes.get("/records/:page?", main.records);
routes.get("/records/obituary/:id", main.obituary);
routes.get("/account", main.account);

// game routes (these will be replaced by controllers)
routes.get("/play", game_life.play);
routes.get("/game/life", game_life.get);
routes.post("/game/life", game_life.create);
routes.get("/game/over", game_life.end);

// manual routes
routes.get("/manual", manual.index);
routes.get("/manual/:page", manual.index);

// hotel routes
routes.get("/game/hotel", game_hotel.index);

// market routes
routes.get("/game/market", game_market.index);
routes.post("/game/market/transaction", game_market.transaction);
routes.delete("/game/market/transaction", game_market.dump);

// airport routes
routes.get("/game/airport", game_airport.index);
routes.post("/game/airport/fly", game_airport.fly);

// bank routes
routes.get("/game/bank", game_bank.index);
routes.get("/game/bank/savings", game_bank.transaction);
routes.post("/game/bank/savings", game_bank.transaction);
routes.get("/game/bank/loans", game_bank.lending);
routes.post("/game/bank/loans", game_bank.lending);

// police routes
routes.get("/game/police", game_police.index);
routes.post("/game/police/encounter", game_police.encounter);

// vendor routes
routes.get("/game/vendors", game_vendors.index);
routes.post("/game/vendors/transaction", game_vendors.transaction);

// storage routes
routes.get("/game/storage", game_storage.index);

// for passport
routes.get("/login", async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	await ctx.render("login", {player: player});
});

routes.get("/logout", async(ctx) => {
	ctx.logout();
	await ctx.redirect("/");
});

routes.get("/auth/auth0",
	passport.authenticate("auth0", {
		clientID: config.site.oauth.auth0.clientID,
		domain: config.site.oauth.auth0.domain,
		responseType: "code",
		audience: `https://${config.site.oauth.auth0.domain}/userinfo`,
		scope: "openid profile"
	})
);

routes.get("/auth/auth0/callback",
	passport.authenticate("auth0", {
		successRedirect: "/account",
		failureRedirect: "/"
	})
);

app.use(routes.middleware());
