# :smiley_cat: paw-wars [![Build Status](https://api.travis-ci.org/snollygolly/paw-wars.svg?branch=master)](https://travis-ci.org/snollygolly/paw-wars)
A spiritual successor to [Drugwars](https://en.wikipedia.org/wiki/Drugwars), but with cats.

## Overview
[Paw Wars](http://pawwars.org) is a game that takes place in a world where dogs are the ruling class and cats are treated as lower class citizens. Luxury items are strictly forbidden, but a black market persists. You take on the role of a smuggler trying to provide contraband to cats in need. You travel the world buying and selling items, avoiding police, and trying to get rich to die trying.

#### If you want to play the game, go here: [Paw Wars](http://pawwars.org)

#### If you want to read the manual: [Paw Wars: The Definitive Guide](http://pawwars.org/manual)

#### If something doesn't work right: [Issue Tracker](https://github.com/snollygolly/paw-wars/issues/new)

---
## Technical Information

### Requirements
* [Node.js](https://nodejs.org/en/) (Version 5 and up recommended)
* [Bower](http://bower.io/)
* [Grunt](http://gruntjs.com/)
* [RethinkDB](http://www.rethinkdb.com/)

### Recommendations
* [Github Client ID and Secret](https://github.com/settings/developers) (for OAuth)

### Installation

* Clone down the repository.
```
git clone https://github.com/snollygolly/paw-wars.git
```

* Install node packages (from inside the paw-wars folder).
```
npm install
```

* Install bower packages (from inside the paw-wars folder).
```
bower install
```

* Create your config.  There's a `config.json.example` file in the root.  Edit it to include all your values for the site and your OAuth information.  Save it as `config.json` and leave it in the root.

* If you want to use Google Analytics, set `config.site.analytics` to your Tracking ID and make sure the analytics partial (analytics.hbs) contains the correct Universal Analytics tracking code.  If you don't want to use Google Analytics, remove that property or set it to false.

* Make sure your database is running or start it up.
```
rethinkdb
```

* Run the seed script.
```
npm run seed
```

* Start it up.
```
grunt
```

* Enjoy!

### Game Configuration

The `game.json` file in the root contains most of the information you'll need to completely customize your experience.  Please refer to [Paw Wars: The Definitive Guide](http://pawwars.org/manual) for explanations of most of the configuration values.

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
    |   |-- bower_components
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
