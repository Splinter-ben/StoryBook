const storyRouter = require('express').Router();
const { ensureAuth } = require('../middleware/authentication');
const Story = require('../models/Story');

// @desc    SHOW add page
// @route   GET /stories/add
// @access  Public
storyRouter.get('/stories/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

// @desc    ADD a story
// @route   POST /stories/add
// @access  Private
storyRouter.post('/stories/add', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.render('error/500');
  }
});

// @desc    GET all stories
// @route   GET /stories/add
// @access  Public
storyRouter.get('/stories', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('stories', { stories });
  } catch (error) {
    console.log(error);
    res.render('error/500');
  }
});

module.exports = storyRouter;
