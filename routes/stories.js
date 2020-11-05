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
      .sort({ createdAt: 'asc' })
      .lean();

    res.render('stories', { stories });
  } catch (error) {
    console.log(error);
    res.render('error/500');
  }
});

// @desc    SHOW edit page
// @route   GET /stories/edit/:id
// @access  Public
storyRouter.get('/stories/edit/:id', ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  }).lean();

  if (!story) {
    return res.render('error/404');
  }
  // check if this is the owner of the story
  if (story.user != req.user.id) {
    res.redirect('/stories');
  } else {
    res.render('stories/edit', { story });
  }
});

// @desc    UPDATE story
// @route   PUT /stories/:id
// @access  Private
storyRouter.put('/stories/:id', ensureAuth, async (req, res) => {
  let story = await Story.findById(req.params.id).lean();

  if (!story) {
    return res.render('error/404');
  }

  // check if this is the owner of the story
  if (story.user != req.user.id) {
    res.redirect('/stories');
  } else {
    story = await Story.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.redirect('/dashboard');
  }
});

module.exports = storyRouter;
