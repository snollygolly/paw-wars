"use strict";

const config = require("../config.json");
const common = require("../helpers/common");
const db = require("../helpers/db");

module.exports.convertProfile = (profile) => {
	const player = {
		_id: profile.id,
		username: profile.nickname,
		name: profile.displayName,
		currentLives: [],
		pastLives: []
	};
	return player;
};

module.exports.getPlayer = async(id) => {
	const result = await db.getDocument(id, "players");
	// common.log("debug", "* getPlayer:", result);
	return result;
};

module.exports.createPlayer = async(player) => {
	// update the createdAt time
	player.createdAt = new Date();
	// validate
	const valid = validatePlayer(player);
	// if this player object isn't valid...
	if (valid.status === false) {
		// ...return the error object
		throw new Error("Player object invalid / playerModel.createPlayer");
	}

	const result = await db.insertDocument(player, "players");
	// common.log("debug", "* createPlayer:", result);
	return result;
};

module.exports.replacePlayer = async(player) => {
	// validate
	const valid = validatePlayer(player);
	// if this player object isn't valid...
	if (valid.status === false) {
		// ...return the error object
		throw new Error("Player object invalid / playerModel.replacePlayer");
	}
	const result = await db.replaceDocument({
		_id: player._id
	}, player, "players");
	// common.log("debug", "* replacePlayer:", result);
	return result;
};

function validatePlayer(player) {
	if (!player._id) {return {status: false, reason: "No ID"};}
	if (!player.username) {return {status: false, reason: "No Username"};}
	if (!player.name) {return {status: false, reason: "No Name"};}
	return {status: true};
}
