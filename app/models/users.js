'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  github: {
    id: String,
    displayName: String,
    username: String,
    picture: String
  },
 	polls: [{ type: Number, ref: 'Poll'}]
});

module.exports = mongoose.model('User', User);
