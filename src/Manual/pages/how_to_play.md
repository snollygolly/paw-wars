# [{{config.site.name}}: The Definitive Guide](/manual)

---

## How To Play
__{{config.site.name}}__ is a turn based game. The administrator is able to set a "turn limit." This limit is how many turns you can play before the game is over and your score is calculated.  Your current limit is __{{game.turns}}__.  Keep in mind that if this setting is set to 0 you will be in "endless" mode.

You start with __{{game.person.starting_hp}}__ HP and a maximum of __{{game.person.max_hp}}__ HP.  If you lose all of your available HP the game will end.

Once you choose your starting location you can:

- Visit the [Market](/manual/market) to buy and sell items
- Use the [Airport](/manual/airport) to travel around to different locations
- Go to the [Bank](/manual/bank) to manage your money

The game ends when any of the following take place:

- All of your turns allowed have been used
- You are poor and destitute
- You die

## Tips

- You should pay off your starting loan from the bank as soon as possible.  The interest from their loan will compound every turn.  That means if you take a 5 turn flight, the interest will compound 5 times.  Ouch!

- Sometimes you have to make big moves that are outside the range of what you can afford.  If a very expensive item is on sale and you can't afford it, you should consider taking out a loan to fill your stash with the discount item.  Depending on the discount, it's often worth it to fly to a large city and sell it.

- You should consider the discount of an item when deciding to buy or sell.  If you purchased a large volume of items at a mild discount, it might make sense to wait a little longer until the price is inflated.  If you got items on a steep discount though, offloading them at a mildly inflated price might make sense to free up storage space to get items with a better discount.

- Time is the only thing you can't get more of.  It makes sense to try to take shorter flights whenever possible.  This is especially true if you have a loan from the bank.

- Forget what you're carrying?  Need to dump some contraband so the cops don't find it?  You can manage your current stash by clicking the briefcase icon in the HUD.
---

```
Technical Configuration Options:

game.turns = {{game.turns}}
game.person.starting_hp = {{game.person.starting_hp}}
game.person.max_hp = {{game.person.max_hp}}
```
