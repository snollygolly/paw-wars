const config = require("../config.json");
const MongoClient	= require("mongodb").MongoClient;

// Connection URL
const url = `mongodb://${config.site.db.host}:${config.site.db.port}`;
const dbName = config.site.db.name;


// A custom Error just for database problems.
function MongoDBError(message) {
	this.name = "MongoDBError";
	this.message = (message || "");
}
MongoDBError.prototype = Error.prototype;

module.exports = {
	getDocument: async(id, collection) => {
		try {
			const client = await MongoClient.connect(url, { useNewUrlParser: true });
			const db = client.db(dbName);
			const doc = await db.collection(collection).findOne({_id: id});
			client.close();
			return doc;
		} catch (err) {
			throw new MongoDBError(`DB: Get of [${id}] failed`);
		}
	},
	findDocumentsSimple: async(query, collection) => {
		try {
			const client = await MongoClient.connect(url, { useNewUrlParser: true });
			const db = client.db(dbName);
			const doc = await db.collection(collection).find(query).toArray();
			client.close();
			return doc;
		} catch (err) {
			throw new MongoDBError(`DB: Find (Simple) of [${JSON.stringify(query)}] failed`);
		}
	},
	findDocumentsFull: async(query, projection, sort, skip, limit, collection) => {
		try {
			const client = await MongoClient.connect(url, { useNewUrlParser: true });
			const db = client.db(dbName);
			const doc = await db.collection(collection)
			 .find(query, projection)
			 .sort(sort)
			 .skip(skip)
			 .limit(limit)
			 .toArray();
			client.close();
			return doc;
		} catch (err) {
			throw new MongoDBError(`DB: Find (Full) of [${JSON.stringify(query)}] failed`);
		}
	},
	insertDocument: async(document, collection) => {
		try {
			const client = await MongoClient.connect(url, { useNewUrlParser: true });
			const db = client.db(dbName);
			const doc = await db.collection(collection).insertOne(document);
			client.close();
			return doc.ops[0];
		} catch (err) {
			throw new MongoDBError(`DB: Insert of [${document._id}] failed`);
		}
	},
	updateDocument: async(query, params, collection) => {
		try {
			const client = await MongoClient.connect(url, { useNewUrlParser: true });
			const db = client.db(dbName);
			const doc = await db.collection(collection).findOneAndUpdate(query, params, {
				returnOriginal: false
			});
			client.close();
			return doc.value;
		} catch (err) {
			throw new MongoDBError(`DB: Insert of [${id}] failed`);
		}
	},
	replaceDocument: async(query, document, collection) => {
		try {
			const client = await MongoClient.connect(url, { useNewUrlParser: true });
			const db = client.db(dbName);
			const doc = await db.collection(collection).replaceOne(query, document);
			client.close();
			return doc.ops[0];
		} catch (err) {
			throw new MongoDBError(`DB: Replace of [${document._id}] failed`);
		}
	}
};
