const viewRouter = require('express').Router();

// @desc    Login/Landing Page
// @route   GET /
// @access  Public
viewRouter.get('/', (req, res) => {
  res.render('login', { layout: 'login' });
});

// @desc    Dasboard/Dasboard Page
// @route   GET /dashboard
// @access  Public
viewRouter.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

module.exports = viewRouter;
