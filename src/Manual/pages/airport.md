# [{{config.site.name}}: The Definitive Guide](/manual)

---

## Airport
The airport is the place you go to change locations and explore new markets.  Size plays an important role in Airports as well as [Markets](/manual/market).  The smaller a city, the fewer outbound flights it has.  The bigger a city, the more outbound flights it has.  The amount that the size of a city contributes to outbound flight availability is currently __{{math game.airport.size_affect \"*\" 100}}%__.  For all the [Places](/manual/places) in the game, there is a size assigned to it (displayed in millions of people populating that metro area). Based on that size and the maximum size (__{{game.airport.size_max}}__), the availability and price of flights goes up and down.  Much like [Markets](/manual/market), Airports have a "base price as well".  This determines the rough range of prices for flights.  It's currently set at __${{game.airport.base_price}}__.

Flight duration is measured in turns.  If a flight says "5 turns" under it, you will be billed for the price of the ticket, and 5 turns will go by before you are able to visit a market (or perform any other actions).  It's important to realize that interest will continue to be compounded by the [Bank](/manual/bank) while you are traveling.  If you owe a lot of money to the bank in debt, this compounding can be quite drastic.  It's a good idea to find flights that are short and inexpensive.  However, flights that require multiple turns are more likely to have items that you are wanting to sell, so there are tradeoffs to short flights.

The duration of a flight is based on the distance between the two cities.  Our standard cat passenger jet travels at __{{game.airport.plane_speed_m_per_h}}__ meters per hour.  We also have a conversion in place that calculates hours and converts that to turns at a rate of __{{game.airport.turns_per_hour}}__.

There is also an option in the game configuration that makes the flight mechanics work like they did in the classic game where all travel costs a single turn.  This option is called "flat flat" and is currently __{{#if game.airport.flat_flight}}on{{else}}off{{/if}}__.

---

```
Technical Configuration Options:

game.airport.size_affect = {{game.airport.size_affect}}
game.airport.size_max = {{game.airport.size_max}}
game.airport.base_price = {{game.airport.base_price}}
game.airport.plane_speed_m_per_h = {{game.airport.plane_speed_m_per_h}}
game.airport.hours_per_turn = {{game.airport.turns_per_hour}}
game.airport.flat_flight = {{game.airport.flat_flight}}
```
