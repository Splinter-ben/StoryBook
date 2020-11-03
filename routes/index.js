const router = require('express').Router();

// @desc    Login/Landing Page
// @route   GET /
// @access  Public
router.get('/', (req, res) => {
  res.render('login');
});

// @desc    Dasboard/Dasboard Page
// @route   GET /dashboard
// @access  Public
router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

module.exports = router;
