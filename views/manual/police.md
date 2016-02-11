# [{{config.site.name}}: The Definitive Guide](/manual)

---

## Police
Police play a critical role in the mid/late game.  When you first start out, you have __{{game.police.starting_heat}}__ heat.  Heat is an arbitrary measure of how wanted you are in general.  When you engage with police in encounters they find suspicious, you'll build your heat at a rate of __{{game.police.heat_rate}}__ heat per interaction.  Keep in mind that you can have several interactions within an encounter, so heat may be applied multiple times.  A heat cap (of __{{game.police.heat_cap}}__ heat) exists to serve as a guide of where heat should be at the high end of things.  This cap isn't a true cap in that the player's heat may rise above this level.  Police encounters when players have very high heat will be difficult to defeat, and will happen with a good degree of frequency.

Heat isn't the only way you'll get the attention of the police.  Every time you do a [Market](/manual/market) transaction, you'll gain __{{game.police.heat_rate}}__ awareness.  Awareness is tracked on a per country basis, so if you do a lot of market transactions in one country, you awareness with the country will rise.  Awareness is combined with heat to give you your "combined heat".

The number of police officers in an encounter depends solely on the player's combined heat level.  At the heat cap, a total of __{{game.police.total_officers}}__ officers will be present for the encounter.  Keeping in mind that the heat cap is "soft" (in that player heat can rise above it), the number of officers in an encounter at high heat may be sizable.

Officers can perform a number of actions during an encounter.  One of the most common is "investigation".  When the police investigate, they may or may not find something depending on the player's available storage and also the investigation proficiency (which is __{{math game.police.investigation_proficiency math.times 100}}%__).  "Searching" is another common action that takes place when the player gives consent, or an investigation is successful and the police have probable cause.  The success of the search depends on how many available storage the player has (less is better for the player), and what the search proficiency rate is (__{{math game.police.search_proficiency math.times 100}}__%).

Multiple choices will be presented to the player when in a police encounter, but three choices are almost always available.

Hiss: This action can be thought of as a last ditch effort.  It's a high risk/high reward action.  If the hiss fails, the officer attacks the player for 2x the normal base damage of __{{game.police.base_damage}}__ HP.  However, if the hiss succeeds (which happens __{{math game.police.hiss_success_rate math.times 100}}%__ of the time), the encounter ends, and the player is free to leave.

Run: This action is good when you're positive you're about to be detained, and you have enough health to take a few shots.  If the run fails, the officer attacks the player for 1x the normal base damage of __{{game.police.base_damage}}__ HP.  However, if the run succeeds (which happens __{{math game.police.run_success_rate math.times 100}}%__ of the time), the encounter ends, and the player is free to leave.

Fight: This action is good when you have high quality weapons and lots of health.  You'll attempt to defeat the officer in a gun battle.  If the attack fails (which happens __{{math game.police.accuracy_police_base math.times 100}}%__ of the time), the officer attacks the player for 1x the normal base damage of __{{game.police.base_damage}}__ HP.  However, if the attack succeeds (which happens __{{math game.police.accuracy_player_base math.times 100}}%__ of the time), the officer takes damage and the fight continues (until someone loses).  Both accuracy rates are taken into consideration during each fight interaction.  It's entirely possible for both the player and the police to miss or hit.

---

```
Technical Configuration Options:

game.police.starting_heat = {{game.police.starting_heat}}
game.police.heat_rate = {{game.police.heat_rate}}
game.police.heat_cap = {{game.police.heat_cap}}
game.police.total_officers = {{game.police.total_officers}}
game.police.investigation_proficiency = {{game.police.investigation_proficiency}}
game.police.search_proficiency = {{game.police.search_proficiency}}
game.police.base_damage = {{game.police.base_damage}}
game.police.hiss_success_rate = {{game.police.hiss_success_rate}}
game.police.run_success_rate = {{game.police.run_success_rate}}
game.police.accuracy_police_base = {{game.police.accuracy_police_base}}
game.police.accuracy_player_base = {{game.police.accuracy_player_base}}
```
