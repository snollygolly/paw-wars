"use strict";

const hbs = require("koa-hbs");
const config = require("../config.json");
const items = require("../models/game/items.json");

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
