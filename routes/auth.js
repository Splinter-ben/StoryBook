const authRouter = require('express').Router(),
  passport = require('passport');

// @desc    Auth with google
// @route   GET /auth/google
// @access  Public
authRouter.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

// @desc    Google auth callback
// @route   GET /auth/google/callback
// @access  Public
authRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

module.exports = authRouter;
