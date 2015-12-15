// This script initializes all the databases in DynamoDB
var _ = require('lodash');
var vogels = require('vogels');
var async = require('async');
var models = require('../db');

var tableMetadata = {};
_.each(models, function(model, name) {
  tableMetadata[model.tableName] = {
    readCapacity: 1,
    writeCapacity: 1
  };
});

vogels.createTables(tableMetadata, function(err) {
  err && console.log(err);
  !err && console.log('Successfully created all databases');
});
