'use strict';

var Polls = require('../models/polls.js');
var Users = require('../models/users.js');
var _ = require('underscore');

function chartHandler(){

	this.getPoll = function(req, res){
		Polls.find({}).populate('author', 'github').sort({ _id: -1 }).exec(function(err, result){
			if (err) { throw err; }
			res.json({result: result});
		});
	};

	this.myPolls = function(req, res){
		Users.findById(req.user.id).populate({ path: 'polls', options: {sort: {_id: -1}}}).exec(function(err, user){
			if (err) { throw err; }
			res.json({result: user.polls});
		});
	}

	this.getOnePoll = function(req, res){
		Polls.findById(req.params.poll_id).populate('author', 'github').exec(function(err, result){
			if (err) { throw err; }
			res.json({result: result, ip: req.headers['x-forwarded-for']});
		});
	};	

	this.updatePoll = function(req, res){
		Polls.findById(req.params.poll_id).populate('author', 'github').exec(function(err, result){
			if (err) throw err;
			console.log(result.voters);
			if (result.voters.indexOf(req.headers['x-forwarded-for']) >= 0) {
				res.redirect('/');
			}
			var added;
			var option = req.body.option;
			var own = req.body.own;
			for(var i=0; i < result.chartData[0].length; i++){
				if(result.chartData[0][i] == option || result.chartData[0][i] == own) {
					result.chartData[1][i] += 1;
					added = true;
				}
			};
			if (!added){
				result.chartData[0].push(own);
				result.chartData[1].push(1);
			}
			result.markModified('chartData');
			result.voters.push(req.headers['x-forwarded-for']);
			result.markModified('voted');
			result.save(function(err, doc){
				if (err) throw err;
				res.json({result: doc});
			});
		});
	};

	this.newPoll = function(req, res){
		var body = req.body;

		var options = _.reject(_.uniq(body.options), function(s){ return s == ''; });
		var values = [];
		for (var i in options){
			values.push(0);
		}
		var chartData = [options, values]

		Polls.find({}).sort({ _id: -1 }).limit(1).exec(function(err, result){
			if (err) { throw err; }
			var newDoc = new Polls({ _id: result[0]._id + 1, author: req.user.id, question: body.question, chart: body.chart, color: body.hue, chartData: chartData});
			newDoc.save(function(err, doc){
				if (err) throw err;
			});
			Users.findById(req.user.id).exec(function(err, user){
				if (err) throw err;
				user.polls.push(newDoc);
				user.save(function(err, doc){
					if (err) throw err;
					res.redirect('/polls/'+newDoc._id);
				});
			});
		});
	};

	this.deletePoll = function(req, res){
		Polls.remove({_id: req.params.poll_id}, function(err){
			if (err) { throw err; }
			Users.findById(req.user.id).exec(function(err, user){
				if (err) throw err;
				user.polls.splice(user.polls.indexOf(req.params.poll_id), 1);
				user.save(function(err, doc){
					if (err) throw err;
				});
			});
		});
	}

	function rand() {
		return Math.floor((Math.random() * 10) + 1); 
	}
}

module.exports = chartHandler;

