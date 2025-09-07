# :smiley_cat: paw-wars [![Node.js CI](https://github.com/snollygolly/paw-wars/actions/workflows/node.js.yml/badge.svg)](https://github.com/snollygolly/paw-wars/actions/workflows/node.js.yml)

![Paw Wars](https://raw.githubusercontent.com/snollygolly/paw-wars/master/assets/img/paw-wars-logo.png)

Paw Wars is a game that takes place in a world where dogs are the ruling class and cats are treated as lower class citizens. Luxury items are strictly forbidden, but a black market persists. You take on the role of a smuggler trying to provide contraband to cats in need. You travel the world buying and selling items, avoiding police, and hustling to get rich or die trying.

### Play it right now in your browser: [Play PawWars](https://pawwars.org)

#### If something doesn't work right: [Issue Tracker](https://github.com/snollygolly/paw-wars/issues/new)
#### To contribute to the game: [Contributing](https://github.com/snollygolly/paw-wars/blob/master/.github/CONTRIBUTING.md)

---
## :heart_eyes_cat: Technical Information

### Requirements
* [Node.js](https://nodejs.org/en/) (Version 22 and up recommended)
* [MongoDB](https://www.mongodb.com/) (With a database called "PawWars", or change the database at `config.json`)

### Recommendations
* [Auth0 Account](https://auth0.com/) (for OAuth)
* [Redis](https://redis.io) (for sessions in production, falls back to in memory without redis running)

### Installation

* Clone down the repository.
```
git clone https://github.com/snollygolly/paw-wars.git
```

* Install node packages (from inside the paw-wars folder).
```
npm install
```

* Create your config.  There's a `config.example.json` file in the root.  Edit it to include all your values for the site and your OAuth information.  Save it as `config.json` and leave it in the root.

* If you want to use Google Analytics, set `config.site.analytics` to your Tracking ID and make sure the analytics partial (analytics.hbs) contains the correct Universal Analytics tracking code.  If you don't want to use Google Analytics, remove that property or set it to false.

* Make sure your database is running or start it up.
```
mongod
```

* Start it up.
```
npm start
```

* Enjoy!

### Game Configuration

The `game.json` file in the root contains most of the information you'll need to completely customize your experience.  Please refer to Paw Wars: The Definitive Guide for explanations of most of the configuration values.

### Folder Structure

```
|-- paw-wars
    |-- config.json
		(config.json holds all the application configuration)
    |-- game.json
		(game.json holds all game related configuration values)
    |-- routes.js
		(all routing is done here)
    |-- assets
		(front end assets go here)
    |   |-- css
    |   |-- fonts
    |   |-- js
    |-- controllers
		(all controllers go here, no controller logic in routes)
    |-- helpers
		(helpers for front end [handlebars] and back end [common] are here)
    |-- models
		(all game logic code goes here, tests run against this code)
    |   |-- game_life.js
		(wrapper for all game sub modules)
    |   |-- game
    |       |-- data
			(configuration/localization files go here)
    |       |   |-- deaths.json
    |       |   |-- events.json
    |       |   |-- items.json
    |       |   |-- places.json
    |       |   |-- police.json
    |       |   |-- vendors.json
    |       |-- vendors
    |-- tests
		(all tests go here)
    |-- views
		(all view related content goes here)
        |-- _layouts
        |-- _partials
        |-- game
        |-- manual
```
