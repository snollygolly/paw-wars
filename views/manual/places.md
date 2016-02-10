# [{{config.site.name}}: The Definitive Guide](/manual)

---

## Places
Places are defined as destinations you can travel to.  Each place is unique, and has a number of parameters that determine how it behaves.

* ID: This is the internal identification for this specific place (also the airport code).
* Name: This is the name of the airport you're flying in to.
* City: This is the city this place is in.
* Country: This is the country this place is in.
* Continent: This is the continent this place is in.
* Size: This is how many millions of people live in this metro area.
* Lat/Long: This is the latitude and longitude for this specific airport.

{{#each places}}

#### {{city}}, {{country}}
* ID: {{id}}
* Name: {{name}}
* City: {{city}}
* Country: {{country}}
* Continent: {{continent}}
* Size: {{size}}
* Latitude: {{coordinates.latitude}}
* Longitude: {{coordinates.longitude}}

{{/each}}

---

```
Technical Configuration Options:

none
```
