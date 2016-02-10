"use strict";

const fs = require("fs");
const hbs = require("koa-hbs");
const Handlebars = require("handlebars");
const marked = require("marked");
const config = require("../config.json");
const game = require("../game.json");
const common = require("./common");
const items = require("../models/game/data/items.json");

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

hbs.registerHelper("math", function math(lvalue, operator, rvalue, options) {
	lvalue = parseFloat(lvalue);
	rvalue = parseFloat(rvalue);

	switch (operator) {

	case "+": return lvalue + rvalue;
	case "-": return lvalue - rvalue;
	case "*": return lvalue * rvalue;
	case "/": return lvalue / rvalue;
	case "%": return lvalue % rvalue;
	default: return false;
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

hbs.registerHelper("get_deal_indication", function stringify(id, price, opts) {
	const itemObj = common.getObjFromID(id, items);
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

hbs.registerHelper("md_partial", function md_partial(partial, opts) {
	const data = {
		game: game,
		config: config
	};
	const rawFile = fs.readFileSync(`views/manual/${partial}.md`, "utf8");
	const parsedFile = marked(rawFile);
	const template = Handlebars.compile(parsedFile);
	return template(data);
});
