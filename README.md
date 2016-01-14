# :smiley_cat: paw-wars
A modern take on [Drugwars](https://en.wikipedia.org/wiki/Drugwars) (Dopewars), but with cats.

## Prerequisites
* [Node.js](https://nodejs.org/en/) (Version 5 and up recommended)
* [Bower](http://bower.io/)
* [RethinkDB](http://www.rethinkdb.com/)
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
npm start
```

* Enjoy!
