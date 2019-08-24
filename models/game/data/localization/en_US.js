const common = require("../../../../helpers/common");

module.exports = {
	// optionally includes flag to dump phrases for testing
	event_starting: (data) => {
		const phrases = [
			"You feel like this is the first day of the rest of your life.",
			"You wake up feeling refreshed and ready to conquer the world.",
			"Game face on. You're ready to take on this day!",
			"Welcome to a whole new day. You are feeling positive and ready to go.",
			"The day has finally arrived and it is time to get started. You feel nervous - in a good way."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// optionally includes flag to dump phrases for testing
	event_no_event: (data) => {
		const phrases = [
			"Nothing of interest happened this turn.",
			"No events of interest to speak of today.",
			"No news is good news and there is nothing new to report.",
			"Keep it casual, no new developments.",
			"A well needed break, nothing new happened. Take a breath."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// includes adjustment and flag to dump phrases for testing
	event_item_bust: (data) => {
		const phrases = [
			`The dogs have made a big bust on ${data.item.name}!  Prices are going through the roof.`,
			`${data.item.name} is on the dogs radar!  Expect a price hike.`,
			`Dogs have confiscated significant ${data.item.name}.  They are no longer going to be cheap.`
		];
		if (data.all) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// includes adjustment and flag to dump phrases for testing
	event_item_flood: (data) => {
		const phrases = [
			`Cat dealers have flooded the market with cheap ${data.item.name}.  Prices have bottomed out.`,
			`Loads of ${data.item.name} have hit the market.  Prices are low as ever.`,
			`Supply of ${data.item.name} is higher than ever and the prices are low in return.`
		];
		if (data.all) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// includes adjustment and flag to dump phrases for testing
	event_free_item: (data) => {
		const phrases = [
			`You run into a cat at the airport.  He shakes your hand, and slips you a few units of ${data.item.name}.  He smiles and walks off without saying anything.`,
			`You find a few units of ${data.item.name} on the ground outside the airport!`,
			`It is your lucky day. Someone left a stash of ${data.item.name} unattended.`
		];
		if (data.all) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// includes adjustment and flag to dump phrases for testing
	event_free_cash: (data) => {
		const phrases = [
			`A cat hands you an envelope at the airport with your name on it.  You look down to open the envelope and see ${data.total}!  When you look up to thank the stranger, they're gone.`,
			`You find ${data.total} on the ground outside the airport!`,
			`Someone is looking out for you. An anonymous courier drops off a thick envelope. When you open it, you find ${data.total}. But who is it from?`
		];
		if (data.all) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives nothing
	hotel_welcome: (data) => {
		const phrases = [
			"You can relax here and contemplate your next move as long as you'd like. When you're ready, choose somewhere to go.",
			"This is your home base, feel free to check out the market, airport, or bank.  Keep your eye out for vendors too.",
			"Be sure to check out the market for any good deals.  The bank's interest on loans compounds on every turn, so buy low, sell high, and pay them back as soon as you can!"
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an array of countries and their awareness of the player
	obituary_heat_some: (data) => {
		const phrases = [
			`${data.length} national police agencies were aware of them.  Some of them issued star ratings on this cat.  ${data[0].country} issued a ${data[0].star} rating, ${data[1].country} had a rating of ${data[1].star} ${(data[1].star === 1) ? "star" : "stars"}, and ${data[2].country} rated them ${data[2].star} ${(data[2].star === 1) ? "star" : "stars"}.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives nothing
	obituary_heat_none: (data) => {
		const phrases = [
			"A small number of national police agencies were aware of them, but mostly they stayed under the radar."
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an integer
	obituary_stash_highest: (data) => {
		const phrases = [
			`The stash they were carrying was state-of-the-art and had a capacity of ${data} units!  Officials were shocked at the level of sophistication when they saw it.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an integer
	obituary_stash_higher: (data) => {
		const phrases = [
			`They were carrying a very modern stash that was capable of carrying ${data} units of contraband.  The level of engineering put into their stash was seriously impressive.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an integer
	obituary_stash_high: (data) => {
		const phrases = [
			`They were carrying an upgraded stash that was capable of carrying ${data} units of contraband.  It was clear they put some effort into it.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an integer
	obituary_stash_low: (data) => {
		const phrases = [
			`The stash they were carrying was mostly stock and capable of carrying ${data} units of contraband.  They bought an upgrade or two, but they weren't too serious about storing weight.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an integer
	obituary_stash_lower: (data) => {
		const phrases = [
			`They were carrying a completely stock stash that was capable of carrying ${data} units of contraband.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives nothing
	obituary_memories_nothing: (data) => {
		const phrases = [
			"I felt like I didn't really get anything done today.  Honestly, it feels like I haven't gotten anything done my entire life.  Sure makes a cat think."
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an action object + location
	obituary_memories_airport: (data) => {
		const phrases = [
			`I was sitting in the ${data.data.name} in ${data.data.city} when they cat came up to me and tried to slip me something.  I figured it was money (since that keeps happening for some reason), but he slipped me a bag of marshmallows instead.  It's not money, but free candy is free candy.`,
			`My flight got delayed in ${data.data.city}, but I beat my all time high score in Flappy Human.  Totally worth it.`,
			`My heart is still racing.  So get this, I was going through security and right before they checked me, I realized I still had some cat nip in my pocket.  I took a deep breathe, and thought I was done for sure.  As security touched my pocket, he grabbed the bag, pulled it out slightly, and put it back in.  Told me to 'be more careful next time' and winked at me.  Cops in ${data.data.country} aren't half bad.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an action object + location
	obituary_memories_hotel: (data) => {
		const phrases = [
			`I was about to ${(data.data === "check in") ? "check into" : "check out of"} the hotel when the bellcat stopped me and asked if I knew where to have a good time.  I told him I was new to town, but I might be able to help him out.  He looked me dead in the eye and asked for a head scratch.  I don't usually make a habit of doing it, but he looked so happy.  Hooked me up with a free mini bar for my whole stay too.`,
			`I think '${data.data}' must mean something different in this place.  When I told the front desk what I wanted to do, they nodded and smiled and then rushed away.  I must have waited 15 minutes and I was about to leave when they came back carrying a fish packaged up in a to-go container.  Best fish I had all week.  I've got to remember to come back to ${data.location.country}.`,
			`As soon as I ${(data.data === "check in") ? "checked into" : "checked out of"} the hotel I got a call from an old friend I hadn't spoken to in a while.  He told me birds aren't real, but they are actually spies for the government.  Old friends are weird sometimes.`,
			`The hotel here in ${data.location.city} sure is fancy.  They had a fountain in the lobby with fish swimming in it.  They got kind of upset after I ate a couple of them, but don't put fish in a fountain if you don't want them eaten.  That's just common sense.`,
			`The ${data.data} process at the hotel here in ${data.location.city} left something to be desired.  They made all the new guests grab a number and play musical chairs to see who gets service.  I'm lucky I lasted until the end round and got help.  I hate to think what happens to the cats that didn't get a chair fast enough.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an action object + location (item injected in)
	obituary_memories_market: (data) => {
		const phrases = [
			`I was heading to the market to ${data.data.type} the ${data.item.name} and everything seemed fine.  When I met up with the cat I was supposed to see though, he asked if he could pay in fish.  I told him I needed the money and he paid me in money AND fish.  Cats from ${data.location.country} are wild.`,
			`After I want to the market to ${data.data.type} the ${data.item.name} I decided to take in some of the local culture.  I wandered around ${data.location.country} for a while they tried some street food that looked like a deep friend tennis ball.  I don't think it actually was one, but it sure tasted good.  Maybe that's why dogs are always chasing them.`,
			`It was really a great day to ${data.data.type} in the market.  After I dealt with the ${data.item.name}, I went for a nice walk on the boardwalk.  When I got done I sat on a bench nearby and enjoyed some smuggled milk.  I was about to finish when I saw the most beautiful bird fly by and land next to me.  He was sure delicious.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an action object + location
	obituary_memories_event: (data) => {
		let eventType = "";
		if (data.data.type === "adjust_cash") {
			eventType = "I ran into a cat who gave me a wad of cash.";
		} else if (data.data.type === "adjust_inventory") {
			eventType = "I found some cat who gave me a bunch of contraband.";
		} else if (data.data.type === "adjust_market") {
			eventType = "The market was going crazy, prices were out of control.";
		} else {
			eventType = "I talked to some cats, but they weren't sure what has happening.";
		}
		const phrases = [
			`On the way back from the hotel today in ${data.location.country}, things were really wild.  ${eventType}  I decided I had enough excitement for the day and stayed inside the rest of the day.  Browsed through some matches on Swattr and set up a date for later in the week.  I'm a sucker for a tabby.`,
			`I've got to start spending more time out and about in ${data.location.country}.  ${eventType}  I decided to take advantage and grab some ice cream while I was out.  If I ever get back to ${data.location.country}, I'm definitely going to have to get another cone of '${data.location.city} Special Surprise'.  I think the surprise is fish.  Absolutely delicious.`,
			`${eventType}  That kind of set the pace for the rest of the day.  After grabbing some lunch though, I decided to find a nice place to curl out and catch some sun.  I highly recommend the fountains in ${data.location.city}, they were fantastic.  Not a lot of dog traffic, and the warmest spot I've found on this whole trip.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an action object + location
	obituary_memories_bank: (data) => {
		const phrases = [
			`Banks in ${data.location.country} aren't a place where you'd expect hospitality, but they sure delivered.  I just went in for a quick ${data.data.type} and they gave me a free fish with my transaction.  I wonder if they do that for all the cats.`,
			`I popped into the bank to ${data.data.type} $${data.data.amount}, but as I was leaving the guard dog stopped me and ask if I dropped some money.  He pointed to a pile on the ground and after a brief deliberation, I told him it wasn't mine.  I was kicking myself for not taking advantage of it, but after I left, I found a coupon for a free ice cream.  Being honest has its advantages.  Besides, I can always just go steal it later.`,
			`The bank in ${data.location.city} looked like it came straight out of a war zone.  I think the tellers even had flak jackets on.  I made my ${data.data.type} and got out of there quickly.  One of the customers forgot her deposit slip and I think they tased her.  Not cool bank, not cool.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an action object + location
	obituary_memories_vendor: (data) => {
		const phrases = [
			`The ${data.data.vendor} vendor was in town today.  I stopped by and picked up some of their wares.  That ${data.data.vendor} really doesn't mess around.  Asked me what I wanted rudely and kicked me out as soon as I had it.  I didn't even get a punch card.  Remind me not to go back, I need those loyalty points.`,
			`After I left the ${data.data.vendor} vendor, I wanted to walk around a little bit and explore ${data.location.city}.  Did you know that they wear shoes on their head over there?  The books never really mention that.  What a beautiful and strange culture.`,
			`I was on my way to swing by the ${data.data.vendor} vendor, but before I got there, I stumbled across a street vendor selling some kind of boiled eye.  It smelled like hot garbage pizza and looked like a slimy blob.  Obviously I had to try it.  It looked just like it smelled, delicious.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an action object + location
	obituary_memories_police: (data) => {
		const phrases = [
			`I got harrassed by Officer Bark today.  I was just minding my own business doing some light smuggling in ${data.location.city} when he pulled me over and wanted to search my car.  I shoved all the contraband deep in my stash and told him I knew my rights and he should come back with a warrant.`,
			`The cops in ${data.location.country} are crazy.  He stopped me to check out what I was carrying, but got started drooling and jumping when he saw the rubber ball I keep in my dashboard.  I asked if he'd like to chase it a little bit, maybe in exchange for letting me go.  He agreed, but made me throw it for him...20 times.  At least if he's asleep on the side of the road, he's not sending me to jail.  That's a win in my book.`,
			`When the cop pulled me over in ${data.location.city}, I just panicked and started barking at him.  He tucked his tail between his legs and apologized all the way back to his car.  I've got to remember to try that again next time.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an action object + location
	obituary_memories_morning: (data) => {
		const phrases = [
			`On day ${data.turn}, I woke up and exected it to be like any other day.`,
			`Day ${data.turn} was kind of odd.`,
			`I didn't think day ${data.turn} would be very exciting, but it certainly was.`,
			`I woke up on day ${data.turn} and found a grey hair.`,
			`Time flies when you're smuggling!  It's day ${data.turn} already and it feels like hardly any time has passed.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives an action object + location
	obituary_memories_evening: (data) => {
		const phrases = [
			"After a long day, I curled up in bed and it was absolutely sublime.",
			"I ended the day by watching some FluffFlix and eating in my room.",
			"I definitely slept well after the busy day I had.",
			"I laid in bed that night and thought about my trip so far.",
			"I had a hard time sleeping that night.  I tried counting bunnies, but I kept trying to eat them."
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives a police object
	police_starting: (data) => {
		const phrases = [
			"As you arrive at the hotel, you",
			"Finally at the hotel, you",
			"You make it to the hotel, and"
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives a police object
	police_starting_singular: (data) => {
		const phrases = [
			`see an officer arrive behind you. The officer has ${data.total_hp} HP.`,
			`are surprised by an officer. The officer has ${data.total_hp} HP.`,
			`cannot believe that an officer is already there. The officer has ${data.total_hp} HP.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives a police object
	police_starting_plural: (data) => {
		const phrases = [
			`${data.officers} officers arrive behind you. They have ${data.total_hp} HP.`,
			`${data.officers} officers just showed up! They have ${data.total_hp} HP.`,
			`You are surprised by ${data.officers} officers who have ${data.total_hp} HP.`
		];
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_discovery_full: (data) => {
		const phrases = [
			"While driving to the hotel you are pulled over by Officer Barks. He gets out of his car and approaches as you roll down your window. 'I hope you are having a nice day,' Officer Barks greets you. 'I stopped you because we have had some reports of suspicious cats in the area. Do you mind if I search your storage for any illegal items?'",
			"You were having a good day but just as you are about to hit the road, you are pulled over by Officer Barks. 'We are following up on reports of suspicious activity. Have you seen anything?'. Surprised, you freeze, so Officer Barks asks to search your storage.",
			"On the way to your next destination you are pulled over my Officer Barks. He asks you some routine questions, but you were trained for this, so you answer diligently. That is, until he asks if he can search your storage."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_discovery_simple: (data) => {
		const phrases = [
			"Officer Barks wants to search your storage.",
			"You are being asked to allow a routine search.",
			"'Can we have a look around?' asks Officer Barks politely."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_investigation_full: (data) => {
		const phrases = [
			"You tell Officer Barks that you don't believe there is any reason to allow him to search. He looks around your storage and says, 'you don't have anything you aren't supposed to, do you?'",
			"You insist on your right to privacy but it does not sound authentic. 'Are you hiding something illegal?', asks Officer Barks.",
			"The mere request to search makes you nervous and you find it difficult to speak. 'Cat got your tongue?' asks Officer Barks with a grin. 'Are we going to find something that should not be there?'"
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_investigation_simple: (data) => {
		const phrases = [
			"Officer Barks wants to know if you have any illegal items.",
			"You are being asked if you are in possession of contraband - admit the truth or lie your pants off?",
			"'Do you have any illegal items?' What do you say?"
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_investigation_successful_full: (data) => {
		const phrases = [
			"You tell Officer Barks that you are a law abiding cat. Officer Barks takes several long sniffs. 'I detect something that you shouldn't have. I will need to search your storage.'",
			"You explain to Officer Barks that you are not that type of cat but he's not buying it. He is going to search your storage anyway.",
			"Fake it until you make it, that's what you tell yourself. You try to be confident but Officer Barks is too good. He will need to search your storage."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_investigation_successful_simple: (data) => {
		const phrases = [
			"Officer Barks is going to search your storage.",
			"Your storage will now undergo inspection.",
			"Prepare to have your storage inspected."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_investigation_failure_full: (data) => {
		const phrases = [
			"You tell Officer Barks that you are a law abiding cat. He takes one more look and sniff around your storage and says, 'everything appears to be in order here. Have a nice day.'",
			"Officer Barks finds nothing and apologizes for the inconvenience. You pretend to understand, stating that he is only doing his job.",
			"Finding nothing, you play angry cat with Officer Barks. 'I'm going to call your supervisor!' you say, as Barks walks away disappointed in himself."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_investigation_failure_simple: (data) => {
		const phrases = [
			"Officer Barks is letting you leave.",
			"You're good to go.",
			"'Go ahead. Scram.' says Officer Barks. Frustrated."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_search_consent_full: (data) => {
		const phrases = [
			"You tell Officer Barks that he is allowed to look through your car. You step out of the driver's seat and follow him back to his vehicle.",
			"You consent to Officer Barks making an inspection and step back from the vehicle. You watch carefully as the inspection takes place.",
			"Feeling lucky, you tell Officer Barks that he can search all he likes. He will not find anything. Watching from a distance - you hope that is true."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_search_consent_simple: (data) => {
		const phrases = [
			"Officer Barks is searching your vehicle.",
			"Your vehicle is being inspected.",
			"Cross your fingers, Officer Barks is searching your car."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_search_probable_cause_full: (data) => {
		const phrases = [
			"Officer Barks looks into your back seat. 'It looks like you are in possesion of some illegal items,' he says. 'I will need to search your storage.' Officer Barks opens your door and gestures for you to get out",
			"Officer Barks doesn't see your items - but he smells them. He finds an item or two and explains that he now needs to search your storage facility. He asks you to get out of the car.",
			"Bad luck. Officer Barks spotted an item in your back seat. He asks if you have a storage facility and not wanting more trouble, you admit you do. Now he has to search that too."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_search_probable_cause_simple: (data) => {
		const phrases = [
			"Officer Barks believes he has spotted some illegal items and wants to search your storage",
			"It looks like they're on to you. Officer Barks requests an inspection.",
			"Officer Barks wants to have a look around. What can you do?"
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_search_successful_full: (data) => {
		const phrases = [
			"Officer Barks performs a search of your storage. He comes back with something in his hands. 'I found this in your storage,' he says. 'You are under arrest for illegal possession.'",
			"After what seemed like forever, Officer Barks comes back from his search. You feel relieved until you notice he found everything you had. 'You are under arrest fo possession', he says.",
			"'Possession is a serious crime', Officer Barks whispers to you. You feel like the walls are closing in as you realize that he found everything you had and you are in serious trouble."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_search_successful_simple: (data) => {
		const phrases = [
			"Officer Barks is going to take you into custody.",
			"Stash found. Your cooked.",
			"Every dog has his day and this one belongs to Officer Barks as he takes you in."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_search_failure_full: (data) => {
		const phrases = [
			"Officer Barks performs a search of your storage. He comes back with nothing. 'It looks like you were telling the truth,' he says. 'You are free to leave.'",
			"Officer Barks performs a search of your storage yet comes back empty handed. 'Looks like I'll have to catch you next time', he says. That was a close one.",
			"You hold your breath and hope that Officer Barks doesn't find your secret stash. By some miracle, he misses it. You breathe a sigh of relief... for now."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_search_failure_simple: (data) => {
		const phrases = [
			"Officer Barks is letting you leave.",
			"They got nothing. You're free to go.",
			"Thank goodness for that hiding spot. You're off the hook."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_admit_guilt_full: (data) => {
		const phrases = [
			"You tell Officer Barks that you are in possession of some illegal items in the hope that he will go easy on you. 'I appreciate your honesty,' he says as he opens your door. 'Step out of the vehicle. You are under arrest.'",
			"Assuming that all hope is lost, you decide to admit your guilt and beg for mercy. But it looks like they're fresh out of mercy today. You feel the cold sensations of cuffs as you are placed under arrest.",
			"You decide to forego your right to silence and just admit to the charges. Officer Barks certainly has bigger fish to catch. But you forget that cats catch fish. Dogs catch cats. And now they've got you."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_admit_guilt_simple: (data) => {
		const phrases = [
			"You are going to jail.",
			"You thought they would go easy on you. They thought otherwise.",
			"You did the crime. Now do the time."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_comply_detain_full: (data) => {
		const phrases = [
			"Officer Barks places you under arrest and puts you in his car.",
			"'Watch your head' says Officer Barks politely, as he detains you.",
			"You have the right to remain silent. You are under arrest."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_comply_detain_simple: (data) => {
		const phrases = [
			"You are going to jail.",
			"You are under arrest.",
			"Stop - in the name of the law."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_crazy_person_full: (data) => {
		const phrases = [
			"'What kind of crazy person tells an officer they have something illegal when they don't?' Officer Barks asks. He shakes his head and walks back to his car before driving off.",
			"'You must be very smart or completely crazy', Officer Barks comments. Looks like he doesn't have much faith in you because he lets you go.",
			"The meaning 'crazy enough to work' very much applies to you. Officer Barks takes one sniff and decides he is better off investing his time elsewhere."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_crazy_person_simple: (data) => {
		const phrases = [
			"Officer Barks is letting you go.",
			"Looks like you're a cat not to be messed with.",
			"Your feline ferocity is one Officer Barks doesn't want a part of."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_escape_full: (data) => {
		const phrases = [
			"You look back and no longer see Officer Barks or any other officers behind you.",
			"You planned for this and it paid off. Remembering your escape plan, you manage to get away.",
			"Those muts didn't see it coming - you pull of an escape maneuver that leaves them wondering if there was ever a cat here at all."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_escape_simple: (data) => {
		const phrases = [
			"You have evaded the police.",
			"Live to purr another day. Nice escape.",
			"You got away. Now that's my kind of cat burglar."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_hiss_success_full: (data) => {
		const phrases = [
			"You hiss and show your teeth to Officer Barks. He stops dead in his tracks and runs away from you.",
			"You caught Officer Barks offguard with your hiss. He backs off.",
			"Nice one. It takes a brave cat to try to scare off a dog like Officer Barks. But you did it!"
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_hiss_success_simple: (data) => {
		const phrases = [
			"You scared Officer Barks away.",
			"Your hiss puts Officer Barks in submission. Who would have thought?",
			"Nice one. That got him."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_hiss_failure_full: (data) => {
		const phrases = [
			"You hiss and show your teeth to Officer Barks. He replies with a loud bark of his own and a hard bite in response.",
			"Hissing at Officer Barks wasn't a good idea. His bark shuts you down and signals his friends.",
			"You hiss at Officer Barks and the growl he returns is so terrifying that you almost jump out of your skin."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_hiss_failure_simple: (data) => {
		const phrases = [
			"You have angered Officer Barks.",
			"Teasing Officer Barks wasn't a smart idea.",
			"Try being more intimidating next time."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_run_success_full: (data) => {
		const phrases = [
			"You get on all fours and make a run for it. Traveling down alleys and side streets you attempt to lose Officer Barks. You take a sharp corner and hide behind a trash can as Officer Barks rounds the same corner. He runs past you undetected.",
			"There's no time to think as your instincts kick in and you try to escape. Out the window, down the lamp post and to the edge of a wall. It's a long leap to the next building - can you make it? You do. Officer Barks never notices you leaping over his head.",
			"Time to run. You duck and evade Officer Barks. Your lightness and agility give you speed, it's just a matter of navigating this maze of a building. You make it outside to an alley with a dead end and hide behind a dumpster, Barks close in pursuit. Rain starts to fall as Barks gives up and walks away."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_run_success_simple: (data) => {
		const phrases = [
			"You escaped Officer Barks.",
			"Escaped by the skins of your paws.",
			"Nice trick. Barks didn't see it coming, as you make it farther and father away."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_run_failure_full: (data) => {
		const phrases = [
			"You get on all fours and make a run for it. Traveling down alleys and side streets you attempt to lose Officer Barks. You take a sharp corner and hide behind a trash can as Officer Barks rounds the same corner. He approaches the trash can and grabs you by the scruff of your neck.",
			"There's no time to think as your instincts kick in and you try to escape. Out the window, down the lamp post and to the edge of a wall. It's a long leap to the next building - can you make it? You try and fall short... landing right on top of Officer Barks, who you didn't notice was waiting below.",
			"Time to run. You duck and evade Officer Barks. Your lightness and agility give you speed, it's just a matter of navigating this maze of a building. You make it outside to an alley with a dead end and hide behind a dumpster, Barks close in pursuit. Just as he is about to give him it starts to rain. It doesn't take him long to find your scent."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_run_failure_simple: (data) => {
		const phrases = [
			"You are going to jail.",
			"Should have used the fire escape. Better luck next time.",
			"You did the crime, now do the time."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_fight_success_full: (data) => {
		const phrases = [
			"You attack Officer Barks. You are able to surprise him and gain the advantage. Several bites and scratches later you feel like you've done a good amount of damage.",
			"Are you some kind of Ninja Kat? You caught Officer Barks completely offguard. As you leave him there in the mud, you begin to wonder if maybe everything is going to be okay after all.",
			"You have the reflexes of a... seasoned smuggler. A quick blow to Officer Barks knocked the wind out of him, allowing you to escape with what's left of your ninve lives."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_fight_success_simple: (data) => {
		const phrases = [
			"You have damaged Officer Barks.",
			"Officer Barks goes down for the count.",
			"A sharp scratch followed by a short howl - you escaped Officer Barks."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_fight_failure_full: (data) => {
		const phrases = [
			"You attack Officer Barks. You attempt to scratch and bite at him, but Officer Barks retaliates with a hard bite of his own.",
			"You chose to pick a fight with Officer Barks, a dog whose bite is much worse than his bark. It did not end well.",
			"You may be one groovy cat, but you're not a strong one. Officer Barks easily overpowers you."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_fight_failure_simple: (data) => {
		const phrases = [
			"You are going to jail.",
			"You have the right to remain adorable. In prison.",
			"Off to the doghouse."
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_dead_full: (data) => {
		const phrases = [
			"Everything goes quiet and dark. The next thing you hear is a voice asking ,'have you been a good kitty?'",
			"A thousand meows welcome you to the pearly litterbox in the sky, but the catflap looks a little small...",
			"You drift through space and time. Suddenly, someone whispers a riddle: 'What do you call a dead kitty? (What's your name, again?)'"
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	},
	// receives flag to dump all phrases for testing
	police_dead_simple: (data) => {
		const phrases = [
			"You have died",
			"Looks like you kicked the bucket",
			"It's cat heaven for you",
			"Cats have nine lives and this was your last one"
		];
		if (data === true) { return phrases; }
		return phrases[common.getRandomInt(0, phrases.length - 1)];
	}
};
