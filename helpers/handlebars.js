"use strict";

const hbs = require('koa-hbs');
const config = require('../config.json');
const items = require('../models/items.json');

hbs.registerHelper('if_eq', function(a, b, opts) {
  if(a == b) // Or === depending on your needs
    return opts.fn(this);
  else
    return opts.inverse(this);
});

hbs.registerHelper('copyright_year', function(opts) {
  return new Date().getFullYear();
});

hbs.registerHelper('get_name', function(opts) {
  return config.site.name;
});

hbs.registerHelper('get_analytics', function(opts) {
  if (config.site.analytics){
    return config.site.analytics;
  }
});

hbs.registerHelper('has_analytics', function(opts) {
  let fnTrue=opts.fn, fnFalse=opts.inverse;
  return (config.site.analytics && config.site.analytics !== false) ? fnTrue() : fnFalse();
});

hbs.registerHelper('life_health_description', function(hp, opts) {
  hp = Number(hp);
  if (hp === 100){
    return "the best you ever have";
  }else if (hp >= 75){
    return "pretty good";
  }else if (hp >= 50){
    return "not so great";
  }else if (hp >= 25){
    return "pretty terrible";
  }else{
    return "near death";
  }
});

hbs.registerHelper('life_inventory', function(id, inventory, opts) {
  for (let item of inventory){
    if (item.id === id){
      return item.units;
    }
  }
  return 0;
});
