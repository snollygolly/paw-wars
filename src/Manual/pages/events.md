# [{{config.site.name}}: The Definitive Guide](/manual)

---

## Events
Events are random encounters that happen as you change turn, and can have a wide variety of effects.  Listing them all out would ruin the fun, but it could range from getting free products, getting free money, or losing everything.  You can't control them, and they happen at random during turn changes.  They happen at a rate of __{{math game.events.event_rate \"*\" 100}}%__.

The way you can tell if an event has taken place is by looking at the [Hotel](/manual/hotel) screen.  Events will never trigger on turn 1, but they may happen at any time after that.

---

```
Technical Configuration Options:

game.events.event_rate = {{game.events.event_rate}}
```
