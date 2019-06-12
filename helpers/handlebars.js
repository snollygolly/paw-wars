"use strict";

const Handlebars = require("handlebars");
const hbs = require("koa-hbs");
const config = require("../config.json");
const game = require("../game.json");
const common = require("./common");
const itemsJSON = require("../models/game/data/items.json");

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
	countryArr.sort((a, b) => { (a.heat > b.heat) ? -1 : 1; });
	if (countryArr.length >= 3) {
		final = `${countryArr.length} national police agencies were aware of them.  Some of them issued star ratings on this cat.  ${countryArr[0].country} issued a ${countryArr[0].star} rating, ${countryArr[1].country} had a rating of ${countryArr[1].star} ${(countryArr[1].star === 1) ? "star" : "stars"}, and ${countryArr[2].country} rated them ${countryArr[2].star} ${(countryArr[2].star === 1) ? "star" : "stars"}.`;
	} else {
		final = "A small number of national police agencies were aware of them, but mostly they stayed under the radar.";
	}
	return final;
});

hbs.registerHelper("get_obit_stash_flavor", function getObitHeat(size, opts) {
	const expanded = size - game.market.starting_storage;
	if (expanded > game.market.starting_storage * 2) {
		return `The stash they were carrying was state-of-the-art and had a capacity of ${size} units!  Officials were shocked at the level of sophistication when they saw it.`;
	} else if (expanded >= game.market.starting_storage * 1.5) {
		return `They were carrying a very modern stash that was capable of carrying ${size} units of contraband.  The level of engineering put into their stash was seriously impressive.`;
	} else if (expanded >= game.market.starting_storage * 1) {
		return `They were carrying an upgraded stash that was capable of carrying ${size} units of contraband.  It was clear they put some effort into it.`;
	} else if (expanded > game.market.starting_storage * 0.5) {
		return `The stash they were carrying was mostly stock and capable of carrying ${size} units of contraband.  They bought an upgrade or two, but they weren't too serious about storing weight.`;
	}
	return `They were carrying a completely stock stash that was capable of carrying ${size} units of contraband.`;
});

hbs.registerHelper("get_obit_memories", function getObitMemories(actions, opts) {
	if (actions.length <= 5) { return "I felt like I didn't really get anything done today.  Honestly, it feels like I haven't gotten anything done my entire life.  Sure makes a cat think."; }
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
	const actionTypes = {
		airport: (a) => {
			const phrases = [
				`I was sitting in the ${a.data.name} in ${a.data.city} when they cat came up to me and tried to slip me something.  I figured it was money (since that keeps happening for some reason), but he slipped me a bag of marshmallows instead.  It's not money, but free candy is free candy.`,
				`My flight got delayed in ${a.data.city}, but I beat my all time high score in Flappy Human.  Totally worth it.`,
				`My heart is still racing.  So get this, I was going through security and right before they checked me, I realized I still had some cat nip in my pocket.  I took a deep breathe, and thought I was done for sure.  As security touched my pocket, he grabbed the bag, pulled it out slightly, and put it back in.  Told me to 'be more careful next time' and winked at me.  Cops in ${a.data.country} aren't half bad.`
			];
			return phrases[common.getRandomInt(0, phrases.length - 1)];
		},
		hotel: (a) => {
			const phrases = [
				`I was about to ${(a.data === "check in") ? "check into" : "check out of"} the hotel when the bellcat stopped me and asked if I knew where to have a good time.  I told him I was new to town, but I might be able to help him out.  He looked me dead in the eye and asked for a head scratch.  I don't usually make a habit of doing it, but he looked so happy.  Hooked me up with a free mini bar for my whole stay too.`,
				`I think '${a.data}' must mean something different in this place.  When I told the front desk what I wanted to do, they nodded and smiled and then rushed away.  I must have waited 15 minutes and I was about to leave when they came back carrying a fish packaged up in a to-go container.  Best fish I had all week.  I've got to remember to come back to ${a.location.country}.`,
				`As soon as I ${(a.data === "check in") ? "checked into" : "checked out of"} the hotel I got a call from an old friend I hadn't spoken to in a while.  He told me birds aren't real, but they are actually spies for the government.  Old friends are weird sometimes.`,
				`The hotel here in ${a.location.city} sure is fancy.  They had a fountain in the lobby with fish swimming in it.  They got kind of upset after I ate a couple of them, but don't put fish in a fountain if you don't want them eaten.  That's just common sense.`,
				`The ${a.data} process at the hotel here in ${a.location.city} left something to be desired.  They made all the new guests grab a number and play musical chairs to see who gets service.  I'm lucky I lasted until the end round and got help.  I hate to think what happens to the cats that didn't get a chair fast enough.`
			];
			return phrases[common.getRandomInt(0, phrases.length - 1)];
		},
		market: (a) => {
			const item = common.getObjFromID(a.data.item, itemsJSON);
			const phrases = [
				`I was heading to the market to ${a.data.type} the ${item.name} and everything seemed fine.  When I met up with the cat I was supposed to see though, he asked if he could pay in fish.  I told him I needed the money and he paid me in money AND fish.  Cats from ${a.location.country} are wild.`,
				`After I want to the market to ${a.data.type} the ${item.name} I decided to take in some of the local culture.  I wandered around ${a.location.country} for a while they tried some street food that looked like a deep friend tennis ball.  I don't think it actually was one, but it sure tasted good.  Maybe that's why dogs are always chasing them.`,
				`It was really a great day for ${(a.data.type === "buy") ? "buying" : "selling"} in the market.  I made an absolute killing on ${item.name}.  While I was sitting on a bench nearby enjoying some smuggled milk, I saw the most beautiful bird fly by and land next to me.  He was sure delicious.`
			];
			return phrases[common.getRandomInt(0, phrases.length - 1)];
		},
		event: (a) => {
			let eventType = "";
			if (a.data.type === "adjust_cash") {
				eventType = "I ran into a cat who gave me a wad of cash.";
			} else if (a.data.type === "adjust_inventory") {
				eventType = "I found some cat who gave me a bunch of contraband.";
			} else if (a.data.type === "adjust_market") {
				eventType = "The market was going crazy, prices were out of control.";
			} else {
				eventType = "I talked to some cats, but they weren't sure what has happening.";
			}
			const phrases = [
				`On the way back from the hotel today in ${a.location.country}, things were really wild.  ${eventType}  I decided I had enough excitement for the day and stayed inside the rest of the day.  Browsed through some matches on Swattr and set up a date for later in the week.  I'm a sucker for a tabby.`,
				`I've got to start spending more time out and about in ${a.location.country}.  ${eventType}  I decided to take advantage and grab some ice cream while I was out.  If I ever get back to ${a.location.country}, I'm definitely going to have to get another cone of '${a.location.city} Special Surprise'.  I think the surprise is fish.  Absolutely delicious.`,
				`${eventType}  That kind of set the pace for the rest of the day.  After grabbing some lunch though, I decided to find a nice place to curl out and catch some sun.  I highly recommend the fountains in ${a.location.city}, they were fantastic.  Not a lot of dog traffic, and the warmest spot I've found on this whole trip.`
			];
			return phrases[common.getRandomInt(0, phrases.length - 1)];
		},
		bank: (a) => {
			const phrases = [
				`Banks in ${a.location.country} aren't a place where you'd expect hospitality, but they sure delivered.  I just went in for a quick ${a.data.type} and they gave me a free fish with my transaction.  I wonder if they do that for all the cats.`,
				`I popped into the bank to ${a.data.type} $${a.data.amount}, but as I was leaving the guard dog stopped me and ask if I dropped some money.  He pointed to a pile on the ground and after a brief deliberation, I told him it wasn't mine.  I was kicking myself for not taking advantage of it, but after I left, I found a coupon for a free ice cream.  Being honest has its advantages.  Besides, I can always just go steal it later.`,
				`The bank in ${a.location.city} looked like it came straight out of a war zone.  I think the tellers even had flak jackets on.  I made my ${a.data.type} and got out of there quickly.  One of the customers forgot her deposit slip and I think they tased her.  Not cool bank, not cool.`
			];
			return phrases[common.getRandomInt(0, phrases.length - 1)];
		},
		vendor: (a) => {
			const phrases = [
				`The ${a.data.vendor} vendor was in town today.  I stopped by and picked up some of their wares.  That ${a.data.vendor} really doesn't mess around.  Asked me what I wanted rudely and kicked me out as soon as I had it.  I didn't even get a punch card.  Remind me not to go back, I need those loyalty points.`,
				`After I left the ${a.data.vendor} vendor, I wanted to walk around a little bit and explore ${a.location.city}.  Did you know that they wear shoes on their head over there?  The books never really mention that.  What a beautiful and strange culture.`,
				`I was on my way to swing by the ${a.data.vendor} vendor, but before I got there, I stumbled across a street vendor selling some kind of boiled eye.  It smelled like hot garbage pizza and looked like a slimy blob.  Obviously I had to try it.  It looked just like it smelled, delicious.`
			];
			return phrases[common.getRandomInt(0, phrases.length - 1)];
		},
		police: (a) => {
			const phrases = [
				`I got harrassed by Officer Bark today.  I was just minding my own business doing some light smuggling in ${a.location.city} when he pulled me over and wanted to search my car.  I shoved all the contraband deep in my stash and told him I knew my rights and he should come back with a warrant.`,
				`The cops in ${a.location.country} are crazy.  He stopped me to check out what I was carrying, but got started drooling and jumping when he saw the rubber ball I keep in my dashboard.  I asked if he'd like to chase it a little bit, maybe in exchange for letting me go.  He agreed, but made me throw it for him...20 times.  At least if he's asleep on the side of the road, he's not sending me to jail.  That's a win in my book.`,
				`When the cop pulled me over in ${a.location.city}, I just panicked and started barking at him.  He tucked his tail between his legs and apologized all the way back to his car.  I've got to remember to try that again next time.`
			];
			return phrases[common.getRandomInt(0, phrases.length - 1)];
		}
	};
	const highlight = actionTypes[action.type](action);
	const morningPhrases = [
		`On day ${action.turn}, I woke up and exected it to be like any other day.`,
		`Day ${action.turn} was kind of odd.`,
		`I didn't think day ${action.turn} would be very exciting, but it certainly was.`,
		`I woke up on day ${action.turn} and found a grey hair.`,
		`Time flies when you're smuggling!  It's day ${action.turn} already and it feels like hardly any time has passed.`
	];
	const eveningPhrases = [
		"After a long day, I curled up in bed and it was absolutely sublime.",
		"I ended the day by watching some FluffFlix and eating in my room.",
		"I definitely slept well after the busy day I had.",
		"I laid in bed that night and thought about my trip so far.",
		"I had a hard time sleeping that night.  I tried counting bunnies, but I kept trying to eat them."
	];
	return `${morningPhrases[common.getRandomInt(0, morningPhrases.length - 1)]}  ${actionTypes[action.type](action)}  ${eveningPhrases[common.getRandomInt(0, eveningPhrases.length - 1)]}`;
});
