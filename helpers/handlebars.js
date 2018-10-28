"use strict";

const fs = require("fs");
const Handlebars = require("handlebars");
const hbs = require("koa-hbs");
const marked = require("marked");
marked.setOptions({
	sanitize: false
});
const config = require("../config.json");
const game = require("../game.json");
const common = require("./common");
const itemsJSON = require("../models/game/data/items.json");
const placesJSON = require("../models/game/data/places.json");

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
		return "the best you ever have";
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

hbs.registerHelper("md_partial", function md_partial(partial, opts) {
	const data = {
		game: game,
		config: config,
		items: itemsJSON,
		places: placesJSON
	};
	const rawFile = fs.readFileSync(`views/manual/${partial}.md`, "utf8");
	// we have to manually replace escaped quotes because of marked
	// https://github.com/chjj/marked/issues/269
	let parsedFile = marked(rawFile);
	parsedFile = parsedFile.replace(/\\&quot;/g, '"');
	const template = Handlebars.compile(parsedFile);
	const final = template(data);
	return final;
});

hbs.registerHelper("get_police_encounter", function log(police) {
	const startingStr = "As you arrive at the hotel, you see ";

	if (police.officers > 1) {
		return `${startingStr} ${police.officers} officers arrive behind you. They have ${police.total_hp} HP.`;
	}

	return `${startingStr} the officer arrives behind you. The officer has ${police.total_hp} HP.`;
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
