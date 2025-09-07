"use strict";

const config = require("./helpers/config");

const common = require("./helpers/common");

const Koa = require("koa");
const hbs = require("koa-hbs");
const serve = require("koa-static");
const mount = require("koa-mount");

// for passport support
const session = require("koa-session");
const bodyParser = require("koa-bodyparser");
const passport = require("koa-passport");

const app = new Koa();

exports.app = app;
exports.passport = passport;

// the auth model for passport support
require("./models/auth");

// misc handlebars helpers
require("./helpers/handlebars");

// trust proxy
app.proxy = true;

// sessions
app.keys = [config.site.secret];
app.use(session(app));

// body parser
app.use(bodyParser());

// authentication
app.use(passport.initialize());
app.use(passport.session());

// statically serve assets
app.use(mount("/assets", serve("./assets")));

// load up the handlebars middlewear
app.use(hbs.middleware({
	viewPath: `${__dirname}/views`,
	layoutsPath: `${__dirname}/views/_layouts`,
	partialsPath: `${__dirname}/views/_partials`,
	defaultLayout: "main"
}));


// Error handling middleware
app.use(async(ctx, next) => {
	try {
		await next();
		if (ctx.state.api === true && ctx.status === 200) {
			ctx.body = {
				error: false,
				result: ctx.body
			};
		}
	} catch (err) {
		ctx.app.emit("error", err, this);
		ctx.status = err.status || 500;
		if (ctx.state.api === true) {
			return ctx.body = {
				error: true,
				message: err.message
			};
		}
		await ctx.render("error", {
			message: err.message
		});
	}
});

require("./routes");

common.log("info", `${config.site.name} is now listening on port ${config.site.port}`);
app.listen(config.site.port);

process.on("SIGINT", function exit() {
	process.exit();
});
