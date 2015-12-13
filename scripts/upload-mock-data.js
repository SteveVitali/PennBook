// This script initializes all the databases in DynamoDB
var _ = require('lodash');
var async = require('async');
var passwordHash = require('password-hash');
var models = require('../db');

var names = [
  'Michael Berke',
  'Alex Rottkamp',
  'Christian Wang',
  'Josef Hoenzsch',
  'Sean Carpenter',
  'Lewis Ellis',
  'Daniel Tan',
  'Ian Sibner',
  'Nikhil Nag',
  'Tony James',
  'Steven Meisler',
  'Eli Mendelson',
  'Hari Nath',
  'Dylan McParland',
  'Justin Kim',
  'Inghu Siddarthan',
  'Sam Soik',
  'Sujay Dewan',
  'Ray Lei',
  'Adam Rawot',
  'Kieraj Mumick',
  'Robin Choi',
  'Hunter Pearl',
  'Harvey Huang',
  'Robbie Knopf',
  'Kyle McKee',
  'Alec Stablow',
  'David Liao',
  'Ben Riedel',
  'JT Cho',
  'Sahil Vanjani'
];

async.each(names, function(name, next) {
  models.User.create({
    email: (
      name.split(' ')[0][0] +
      name.split(' ')[1] +
      '@gmail.com'
    ).toLowerCase(),
    firstName: name.split(' ')[0],
    lastName: name.split(' ')[1],
    birthdate: new Date(),
    gender: 'male',
    createdAt: new Date(),
    passwordHash: passwordHash.generate('ayy lmao'),
    fullName: name,
    school: 'University of Pennsylvania',
    interests: ['LXA']
  }, next);
},
function(err) {
  err && console.log(err);
  console.log('Uploaded dummy data');
});
