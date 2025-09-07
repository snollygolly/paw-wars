"use strict";

const config = require("../helpers/config");
const common = require("../helpers/common");
const db = require("../helpers/db");
const nouns = require("./game/data/nouns.json");
const adjectives = require("./game/data/adjectives.json");

module.exports.convertProfile = (profile) => {
	const player = {
		_id: profile.id,
		guest: (profile.guest) ? true : false,
		username: profile.nickname,
		name: profile.displayName,
		currentLives: [],
		pastLives: []
	};
	if (player.guest === true) {
		player.name = player.username = generateName();
	}
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

function generateName() {
	return `${common.capitalizeWord(adjectives[common.getRandomInt(0, adjectives.length - 1)])} ${common.capitalizeWord(nouns[common.getRandomInt(0, nouns.length - 1)])}`;
}
