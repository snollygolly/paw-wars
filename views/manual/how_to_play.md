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

---

```
Technical Configuration Options:

game.turns = {{game.turns}}
game.person.starting_hp = {{game.person.starting_hp}}
game.person.max_hp = {{game.person.max_hp}}
```
