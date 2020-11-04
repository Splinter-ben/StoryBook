const viewRouter = require('express').Router();
const { ensureAuth, ensureGuest } = require('../middleware/authentication');

// @desc    Login/Landing Page
// @route   GET /
// @access  Public
viewRouter.get('/', ensureGuest, (req, res) => {
  res.render('login', { layout: 'login' });
});

// @desc    Dasboard/Dasboard Page
// @route   GET /dashboard
// @access  Public
viewRouter.get('/dashboard', ensureAuth, (req, res) => {
  res.render('dashboard');
});

module.exports = viewRouter;
