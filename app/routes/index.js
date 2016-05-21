'use strict';

var path = process.cwd();
var ChartHandler = require(path + '/app/controllers/chartHandler.server.js');

module.exports = function(app, passport){

  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }

	var chartHandler = new ChartHandler();

	app.route('/').get(function (req, res) {
    res.render('index', {logged: req.isAuthenticated(), currentUrl: "/"});
  });
  app.route('/newpoll').get(isLoggedIn, function (req, res) {
    res.render('newPoll', {logged: req.isAuthenticated(), currentUrl: "/newpoll"});
  });
  app.route('/polls/:poll_id').get(function (req, res) {
    res.render('pollDetail', { logged: req.isAuthenticated(), poll_id: req.params.poll_id });
  });
  app.route('/login').get(function (req, res) {
    res.render('login');
  });
  app.route('/mypolls').get(isLoggedIn, function (req, res) {
    res.render('myPolls', {logged: req.isAuthenticated(), currentUrl: "/mypolls"});
  });
  app.route('/logout').get(function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.route('/auth/github').get(passport.authenticate('github'));
  app.route('/auth/github/callback').get(passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  app.route('/api/polls')
    .get(chartHandler.getPoll)
    .post(isLoggedIn, chartHandler.newPoll);

  app.route('/api/polls/:poll_id')
    .get(chartHandler.getOnePoll)
    .post(chartHandler.updatePoll)
    .delete(isLoggedIn, chartHandler.deletePoll);

  app.route('/api/users').get(isLoggedIn, function (req, res) {
    res.json(req.user.github);
  });

  app.route('/api/mypolls').get(isLoggedIn, chartHandler.myPolls);
}