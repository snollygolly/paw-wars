"use strict";

const config = require('./config.json');

const app = require('./index.js').app;
const passport = require('./index.js').passport;
const Router = require('koa-router');

const routes = new Router();

const main = require('./controllers/main.js');

const game_hotel = require('./controllers/game_hotel.js');
const game_market = require('./controllers/game_market.js');
const game_airport = require('./controllers/game_airport.js');
const game_life = require('./controllers/game_life.js');

// routes
let player = null;

// app routes
routes.get('/', main.index);
routes.get('/account', main.account);

// game routes (these will be replaced by controllers)
routes.get('/play', game_life.play);
routes.post('/game/life', game_life.create);

routes.get('/game/hotel', game_hotel.index);

// market routes
routes.get('/game/market', game_market.index);
routes.post('/game/market/transaction', game_market.transaction);

// airport routes
routes.get('/game/airport', game_airport.index);
routes.post('/game/airport/fly', game_airport.fly);

routes.get('/game/bank', function* (){
  yield this.render('game_bank', {title: config.site.name});
});

// for passport
routes.get('/login', function* (){
  if (this.isAuthenticated()) {
    user = this.session.passport.user;
  }
  yield this.render('login', {player: player});
});

routes.get('/logout', function* () {
  this.logout();
  this.redirect('/');
});

// you can add as many strategies as you want
routes.get('/auth/github',
  passport.authenticate('github')
);

routes.get('/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/account',
    failureRedirect: '/'
  })
);

app.use(routes.middleware());
