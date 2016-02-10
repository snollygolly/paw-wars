# [{{config.site.name}}: The Definitive Guide](/manual)

---

## Items
Items play a critical role in the game.  They are the things that you buy and sell to make money.  They are listed below along with their stats and properties.

* ID: This is the internal identification for this specific item.
* Description: This is the description for this item.
* Rarity: This is the rarity of the item.  It's used to generate pricing information and also unit availability.

{{#each items}}

#### {{name}}
* ID: {{id}}
* Description: {{description}}
* Rarity: {{rarity}}

{{/each}}

---

```
Technical Configuration Options:

none
```
