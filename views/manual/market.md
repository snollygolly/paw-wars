# [{{config.site.name}}: The Definitive Guide](/manual)

---

## Market
The market is the central point in each city for buying and selling illicit cat goods.  Each time you visit a city, that city generates a set of "market listings" that dictate what the price is, and how much is available for you to purchase.  If you don't like what's available on the market in the city you're in, the only way to get different items is to travel to a different city via the [Airport](/manual/airport).

Pricing for all [Items](/manual/items) goes off of a "base price" that is either adjusted up or down.  The current base price is __${{game.market.base_price}}__, which means that all prices are based on that price (give or take a random amount based on a number of factors).  __{{game.market.base_units}}__ is the amount of "base units" available for each item.  Based on factors like rarity, the amount of units a location has in stock varies, but is based on this number.

The size of the city you're currently in affects the price and quantity of items in the market.  The amount that the size of a city contributes to market price/units is currently __{{math game.market.size_affect \"*\" 100}}%__.  For all the [Locations](/manual/locations) in the game, there is a size assigned to it (displayed in millions of people populating that metro area). Based on that size and the maximum size (__{{game.market.size_max}}__), the prices and units go up and down.  This ends up meaning that smaller cities have larger fluctuations, and larger cities have smaller ones.

Storage is an important resource when playing the game.  You start out the game with a maximum storage capacity of __{{game.market.starting_storage}}__.  Once you fill up that storage, you can't buy any more items until you either sell some of the items you have, or increase your storage capacity through [Vendors](/manual/vendors).

---

```
Technical Configuration Options:

game.market.base_price = {{game.market.base_price}}
game.market.base_units = {{game.market.base_units}}
game.market.size_affect = {{game.market.size_affect}}
game.market.size_max = {{game.market.size_max}}
game.market.starting_storage = {{game.market.starting_storage}}
```
