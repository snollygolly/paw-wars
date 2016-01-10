"use strict";

const config = require('./config.json');

const app = require('./index.js').app;
const passport = require('./index.js').passport;
const Router = require('koa-router');

const routes = new Router();

const main = require('./controllers/main.js');

const game_generic = require('./controllers/game_generic.js');
const game_market = require('./controllers/game_market.js');
const game_airport = require('./controllers/game_airport.js');

// routes
let player = null;

// app routes
routes.get('/', main.index);
routes.get('/account', main.account);

// game routes (these will be replaced by controllers)
routes.get('/play', game_generic.play);
routes.get('/game/hotel', game_generic.hotel);

routes.get('/game/market', game_market.index);
routes.get('/game/airport', game_airport.index);

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
