'use strict';

const config = require('../config.json');
const r      = require('rethinkdb');
const co     = require('co');

let connection;

co(function*() {
	let connection = yield r.connect(config.site.db);

	try {
		yield r.dbCreate(config.site.db.db).run(connection);
		console.log(`Databse '${config.site.db.db}' created successfully.`);
	} catch (err) {
		console.log(`Warning! ${err.msg}`);
	}

	try {
		yield r.db(config.site.db.db).tableCreate('players').run(connection);
		console.log('Table \'players\' created successfully.');
	} catch (err) {
		console.log(`Warning! ${err.msg}`);
	}

	try {
		yield r.db(config.site.db.db).tableCreate('lives').run(connection);
		console.log('Table \'lives\' created successfully.');
	} catch (err) {
		console.log(`Warning! ${err.msg}`);
	}

	yield connection.close();
	console.log('\nYou\'re all set!');
	console.log(`Open http://${config.site.db.host}:8080/#tables to view the database.`);
	process.exit();
}).catch(errorHandler);

function errorHandler(err) {
	console.error('Error occurred!', err);
	throw err;
	process.exit();
}