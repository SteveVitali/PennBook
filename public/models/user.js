var Backbone = require('backbone');

var model = Backbone.Model.extend({

  idAttribute: '_id',
  urlRoot: '/api/users',

  defaults: {},

  parse(res) {
    res.id = res._id;
    return res;
  }
});

var collection = Backbone.Collection.extend({
  model: model,
  url: '/api/users'
});

module.exports = {
  model: model,
  collection: collection
};
