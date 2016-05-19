'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema(
  {	"_id" : Number,
  	"author": { type:  Schema.Types.ObjectId, ref: 'User' },
		"question" : String,
		"color": String,
		"chart" : String,
		"chartData" : Array
	},
  { versionKey: false }
  );

module.exports = mongoose.model('Poll', Poll);


