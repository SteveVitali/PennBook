var Backbone = require('backbone');

var model = Backbone.Model.extend({

  idAttribute: '_id',
  urlRoot: '/api/friendships',

  defaults: {},

  parse(res) {
    res.id = res._id;
    return res;
  }
});

var collection = Backbone.Collection.extend({
  model: model,
  url: '/api/friendship'
});

module.exports = {
  model: model,
  collection: collection
};
