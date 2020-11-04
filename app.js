require('colors');
const { json } = require('express');

const express = require('express'),
  path = require('path'),
  exphbs = require('express-handlebars'),
  morgan = require('morgan'),
  passport = require('passport'),
  session = require('express-session'),
  viewRouter = require('./routes/index'),
  authRouter = require('./routes/auth'),
  connectDB = require('./database/atlas'),
  PORT = process.env.PORT,
  app = express();

// Body Parser
app.use(json());

// Morgan Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Sessions (must always be above passport middleware and routes)
app.use(
  session({
    secret: 'Whatever..',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport config
require('./config/passport')(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1', viewRouter, authRouter);

// Database
connectDB();

// Server
const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode, on port: ${PORT}`.yellow
      .bold
  )
);
