"use strict";

const Handlebars = require("handlebars");
const hbs = require("koa-hbs");
const config = require("../config.json");
const game = require("../game.json");
const common = require("./common");
const itemsJSON = require("../models/game/data/items.json");
const localization = require("../models/game/data/localization");

hbs.registerHelper("if_eq", function if_eq(a, b, opts) {
	if (a == b) {
		return opts.fn(this);
	}
	return opts.inverse(this);
});

hbs.registerHelper("if_cond", function if_cond(a, operator, b, options) {
	switch (operator) {

	case "==":
	case "===":
		if (a === b) {
			return options.fn(this);
		}
		return options.inverse(this);
	case "!=":
		if (a !== b) {
			return options.fn(this);
		}
		return options.inverse(this);
	case "<":
		if (a < b) {
			return options.fn(this);
		}
		return options.inverse(this);
	case "<=":
		if (a <= b) {
			return options.fn(this);
		}
		return options.inverse(this);
	case ">":
		if (a > b) {
			return options.fn(this);
		}
		return options.inverse(this);
	case ">=":
		if (a >= b) {
			return options.fn(this);
		}
		return options.inverse(this);
	case "&&":
		if (a && b) {
			return options.fn(this);
		}
		return options.inverse(this);
	case "||":
		if (a || b) {
			return options.fn(this);
		}
		return options.inverse(this);
	default:
		return options.inverse(this);
	}
});

hbs.registerHelper("copyright_year", function copyright_year(opts) {
	return new Date().getFullYear();
});

hbs.registerHelper("get_name", function get_name(opts) {
	return config.site.name;
});

hbs.registerHelper("get_analytics", function get_analytics(opts) {
	if (config.site.analytics) {
		return config.site.analytics;
	}
});

hbs.registerHelper("has_analytics", function has_analytics(opts) {
	const fnTrue = opts.fn;
	const fnFalse = opts.inverse;
	return (config.site.analytics && config.site.analytics !== false) ? fnTrue() : fnFalse();
});

hbs.registerHelper("life_health_description", function life_health_description(hp, opts) {
	hp = Number(hp);
	if (hp === 100) {
		return "in perfect health";
	} else if (hp >= 75) {
		return "pretty good";
	} else if (hp >= 50) {
		return "not so great";
	} else if (hp >= 25) {
		return "pretty terrible";
	}
	return "near death";
});

hbs.registerHelper("life_inventory", function life_inventory(id, inventory, opts) {
	for (const item of inventory) {
		if (item.id === id) {
			return item.units;
		}
	}
	return 0;
});

hbs.registerHelper("format_currency", function format_currency(amount, opts) {
	return addCommas(Math.round(amount / 100));

	function addCommas(nStr) {
		nStr += "";
		const x = nStr.split(".");
		let x1 = x[0];
		const x2 = x.length > 1 ? `.${x[1]}` : "";
		const rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, "$1" + "," + "$2");
		}
		return x1 + x2;
	}
});

hbs.registerHelper("format_percent", function format_percent(percent, opts) {
	return (percent * 100);
});

hbs.registerHelper("plural", function plural(word, amount, opts) {
	return (amount === 1) ? word : `${word}s`;
});

hbs.registerHelper("stringify", function stringify(obj, opts) {
	if (opts === "pretty") {
		return JSON.stringify(obj, null, 2);
	}
	const json = JSON.stringify(obj);
	// replace single quotes
	return json.replace(/'/g, "&#39;");
});

hbs.registerHelper("show_negative", function show_negative(amount, opts) {
	return (amount > 0) ? "-" : "";
});

hbs.registerHelper("get_deal_indication", function stringify(id, price, opts) {
	const itemObj = common.getObjFromID(id, itemsJSON);
	const basePrice = game.market.base_price * (itemObj.rarity / 100);
	const startingStr = "This is ";
	const endingStr = " buy.";
	let modStr = "";
	if (game.features.deal_indication_price_mod === true) {
		modStr += `<br>($${Math.round(basePrice - price)} profit per unit)`;
	}
	// check for really bad deal
	if (price >= (basePrice * 1.45)) {
		return `${startingStr}an amazingly bad${endingStr}${modStr}`;
	}
	if (price >= (basePrice * 1.30)) {
		return `${startingStr}a pretty bad${endingStr}${modStr}`;
	}
	if (price >= (basePrice * 1.15)) {
		return `${startingStr}a bad${endingStr}${modStr}`;
	}
	if (price >= (basePrice * 0.85)) {
		return `${startingStr}an alright${endingStr}${modStr}`;
	}
	if (price >= (basePrice * 0.70)) {
		return `${startingStr}a good${endingStr}${modStr}`;
	}
	if (price >= (basePrice * 0.55)) {
		return `${startingStr}a pretty good${endingStr}${modStr}`;
	}
	if (price >= (basePrice * 0.40)) {
		return `${startingStr}an amazingly good${endingStr}${modStr}`;
	}
	// to catch the left overs
	if (price > basePrice) {
		return `${startingStr}the worst${endingStr}${modStr}`;
	}
	if (price < basePrice) {
		return `${startingStr}the best${endingStr}${modStr}`;
	}
	return `${startingStr}an unknown${endingStr}${modStr}`;
});

hbs.registerHelper("get_item_name", function get_item_name(id, opts) {
	const item = common.getObjFromID(id, itemsJSON);
	return item.name;
});

hbs.registerHelper("get_police_encounter", function log(police) {
	const startingStr = localization("police_starting", police);;

	if (police.officers > 1) {
		return `${startingStr} ${localization("police_starting_plural", police)}`;
	}
	return `${startingStr} ${localization("police_starting_singular", police)}`;
});

hbs.registerHelper("vendors_open", function log(life, opts) {
	for (const vendor of game.vendors.enabled) {
		if (life.listings.vendors[vendor].open === true) {
			return opts.fn(this);
		}
	}
	return opts.inverse(this);
});

hbs.registerHelper("math", math);
Handlebars.registerHelper("math", math);

function math(lvalue, operator, rvalue, options) {
	lvalue = parseFloat(lvalue);
	rvalue = parseFloat(rvalue);

	switch (operator) {

	case "+": return lvalue + rvalue;
	case "-": return lvalue - rvalue;
	case "*": return lvalue * rvalue;
	case "/": return lvalue / rvalue;
	default: return false;
	}
}

hbs.registerHelper("log", log);
Handlebars.registerHelper("log", log);

function log(variable, opts) {
	common.log("info", variable);
	if (opts == "JSON") {
		return JSON.stringify(variable);
	}
	return variable;
}

Handlebars.registerHelper("get_vendor_property", function log(id, property, opts) {
	if (!game.vendors[id]) {
		return "Bad vendor";
	}
	if (!game.vendors[id][property]) {
		return "Bad vendor property";
	}
	return game.vendors[id][property];
});

hbs.registerHelper("is_upgrade_enabled", function isUpgradeEnabled(life, upgradeName, opts) {
	if (life.upgrades.hasOwnProperty(upgradeName)) {
		return life.upgrades[upgradeName].enabled ? opts.fn(this) : opts.inverse(this);
	}

	return opts.inverse(this);
});

hbs.registerHelper("get_item_sunk_cost", function itemSunkCost(id, inventory) {
	for (const item of inventory) {
		if (item.id === id) {
			return item.averagePrice;
		}
	}
	return 0;
});

hbs.registerHelper("get_obit_heat", function getObitHeat(awareness, opts) {
	let final = "";
	const countryArr = [];
	for (const country in awareness) {
		countryArr.push({
			country,
			heat: awareness[country],
			star: Math.round(awareness[country] / game.police.heat_per_star) + 1
		});
	}
	countryArr.sort((a, b) => {
		return (a.heat > b.heat) ? -1 : 1;
	});
	if (countryArr.length >= 3) {
		final = localization("obituary_heat_some", countryArr);
	} else {
		final = localization("obituary_heat_none", countryArr);
	}
	return final;
});

hbs.registerHelper("get_obit_stash_flavor", function getObitHeat(size, opts) {
	const expanded = size - game.market.starting_storage;
	if (expanded > game.market.starting_storage * 2) {
		return localization("obituary_stash_highest", size);
	} else if (expanded >= game.market.starting_storage * 1.5) {
		return localization("obituary_stash_higher", size);
	} else if (expanded >= game.market.starting_storage * 1) {
		return localization("obituary_stash_high", size);
	} else if (expanded > game.market.starting_storage * 0.5) {
		return localization("obituary_stash_low", size);
	}
	return localization("obituary_stash_lower", size);
});

hbs.registerHelper("get_obit_memories", function getObitMemories(actions, opts) {
	if (actions.length <= 5) { return localization("obituary_memories_nothing"); }
	const actionIndex = common.getRandomInt(0, actions.length - 1);
	const action = actions[actionIndex];
	if (action.type !== "airport") {
		let airportIndex = actionIndex;
		let newAction = action;
		while (newAction.type !== "airport") {
			airportIndex--;
			newAction = actions[airportIndex];
		}
		action.location = newAction.data;
	}
	if (action.type === "market") {
		action.item = common.getObjFromID(action.data.item, itemsJSON);
	}

	return `${localization("obituary_memories_morning", action)}  ${localization(`obituary_memories_${action.type}`, action)}  ${localization("obituary_memories_evening", action)}`;
});

hbs.registerHelper("localization", (phrase, data, opts) => {
	let fullPhrase;
	if (data) {
		fullPhrase = localization(phrase, data);
	} else {
		fullPhrase = localization(phrase);
	}
	return fullPhrase;
});
