const storyRouter = require('express').Router();
const { ensureAuth } = require('../middleware/authentication');
const Story = require('../models/Story');

// @desc    GET all stories
// @route   GET /stories
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

// @desc    SHOW a single story
// @route   GET /stories/:id
// @access  Public
storyRouter.get('/stories/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean();

    if (!story) {
      return res.render('error/404');
    }
    res.render('stories/show', {
      story
    });
  } catch (error) {
    console.log(error);
    res.render('error/404');
  }
});

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

// @desc    SHOW edit page
// @route   GET /stories/edit/:id
// @access  Public
storyRouter.get('/stories/edit/:id', ensureAuth, async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    return res.render('error/500');
  }
});

// @desc    UPDATE story
// @route   PUT /stories/:id
// @access  Private
storyRouter.put('/stories/:id', ensureAuth, async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    return res.render('error/500');
  }
});

// @desc    DELETE a story
// @route   DELETE /stories/:id
// @access  Private
storyRouter.delete('/stories/:id', ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    return res.render('error/500');
  }
});

module.exports = storyRouter;
