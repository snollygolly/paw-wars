"use strict";

const config = require("../config.json");
const r = require("rethinkdb");
const co = require("co");
const common = require("./common");

co(async() => {
	const connection = await r.connect(config.site.db);

	try {
		await r.dbCreate(config.site.db.db).run(connection);
		common.log("info", `Databse '${config.site.db.db}' created successfully.`);
	} catch (err) {
		common.log("warn", `Warning! ${err.msg}`);
	}

	try {
		await r.db(config.site.db.db).tableCreate("players").run(connection);
		common.log("info", "Table 'players' created successfully.");
	} catch (err) {
		common.log("warn", `Warning! ${err.msg}`);
	}

	try {
		await r.db(config.site.db.db).tableCreate("lives").run(connection);
		common.log("info", "Table 'lives' created successfully.");
	} catch (err) {
		common.log("warn", `Warning! ${err.msg}`);
	}

	await connection.close();
	common.log("info", "\nYou're all set!");
	common.log("info", `Open http://${config.site.db.host}:8080/#tables to view the database.`);
	process.exit();
}).catch(errorHandler);

function errorHandler(err) {
	common.log("error", "Error occurred!", err);
	throw err;
	process.exit();
}
