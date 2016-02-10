# {{config.site.name}}: The Definitive Guide

---

## How To Play
__{{config.site.name}}__ is a turn based game, as as such, the administrator is able to set a "turn limit".  This limit is how many turns you can play before the game is over and your score is calculated.  Your current limit is __{{game.turns}}__.  Keep in mind that if this setting is set to 0, you'll be in "endless" mode.

You will start off in a city of your choosing with $__{{game.bank.starting_cash}}__ in starting cash, $__{{game.bank.starting_savings}}__ in starting savings, and $-__{{game.bank.starting_debt}}__ in starting debt.

---

```
Technical Configuration Options:

game.turns = {{game.turns}}
game.bank.starting_cash = {{game.bank.starting_cash}}
game.bank.starting_savings = {{game.bank.starting_savings}}
game.bank.starting_debt = {{game.bank.starting_debt}}

```
