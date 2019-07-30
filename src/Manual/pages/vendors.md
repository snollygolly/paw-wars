# [{{config.site.name}}: The Definitive Guide](/manual)

---

## Vendors
Vendors will randomly appear in [Places](/manual/places) as you travel around on your journey.  A vendor will typically offer some item or service in exchange for money.  Keep in mind that vendor prices aren't linear, so the top items can be rather expensive.

Pricing for all vendor listings goes off of a "base price" that is either adjusted up or down.  The current base price is __${{game.vendors.base_price}}__, which means that all prices are based on that price.  

The following vendors are currently enabled __{{game.vendors.enabled}}__

{{#each game.vendors.enabled}}

#### {{this}}
* Start Open: __{{lookup (lookup ../game.vendors this) \"start_open\"}}__
* Frequency: __{{math (lookup (lookup ../game.vendors this) \"frequency\") \"*\" 100}}%__
* Stock: __{{lookup (lookup ../game.vendors this) \"stock\"}}__
* Units: __{{lookup (lookup ../game.vendors this) \"units\"}}__
* Base Price: __${{math (lookup (lookup (lookup ../game.vendors this) \"pricing\") \"times_base\") \"*\" ../game.vendors.base_price}}__
* Next Unit Price Increase: __{{lookup (lookup (lookup ../game.vendors this) \"pricing\") \"increase_rate\"}}x__

{{/each}}

---

```
Technical Configuration Options:

game.vendors.base_price = {{game.vendors.base_price}}
game.vendors.enabled = {{game.vendors.enabled}}
{{#each game.vendors.enabled}}
---
game.vendors.{{this}}.start_open: {{lookup (lookup ../game.vendors this) \"start_open\"}}
game.vendors.{{this}}.frequency: {{lookup (lookup ../game.vendors this) \"frequency\"}}
game.vendors.{{this}}.stock: {{lookup (lookup ../game.vendors this) \"stock\"}}
game.vendors.{{this}}.units: {{lookup (lookup ../game.vendors this) \"units\"}}
game.vendors.{{this}}.pricing.times_base: {{lookup (lookup (lookup ../game.vendors this) \"pricing\") \"times_base\"}}
game.vendors.{{this}}.pricing.increase_rate: {{lookup (lookup (lookup ../game.vendors this) \"pricing\") \"increase_rate\"}}
{{/each}}
```
