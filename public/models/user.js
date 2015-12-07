//import Backbone from 'backbone';
var Backbone = require('backbone');

exports.model = Backbone.Model.extend({

  idAttribute: '_id',
  urlRoot: '/api/users',

  defaults: {},

  parse(res) {
    res.id = res._id;
    return res;
  }
});

exports.collection = Backbone.Collection.extend({
  model: exports.User,
  url: '/api/users'
});
