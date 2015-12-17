var Backbone = require('backbone');

var model = Backbone.Model.extend({

  idAttribute: '_id',
  urlRoot: '/api/statuses',

  defaults: {},

  parse(res) {
    res.id = res._id;
    return res;
  }
});

var collection = Backbone.Collection.extend({
  model: model,
  url: '/api/statuses'
});

module.exports = {
  model: model,
  collection: collection
};
