const viewRouter = require('express').Router();
const { ensureAuth, ensureGuest } = require('../middleware/authentication');
const Story = require('../models/Story');

// @desc    Login/Landing Page
// @route   GET /
// @access  Public
viewRouter.get('/', ensureGuest, (req, res) => {
  res.render('login', { layout: 'login' });
});

// @desc    Dasboard/Dasboard Page
// @route   GET /dashboard
// @access  Public
viewRouter.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();

    res.render('dashboard', {
      name: req.user.firstName,
      stories,
    });
  } catch (error) {
    console.log(error);
    res.render('error/500')
  }
});

module.exports = viewRouter;
