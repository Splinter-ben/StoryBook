require('colors');
const { json } = require('express');

const express = require('express'),
  path = require('path'),
  exphbs = require('express-handlebars'),
  morgan = require('morgan'),
  passport = require('passport'),
  methodOverride = require('method-override'),
  viewRouter = require('./routes/index'),
  authRouter = require('./routes/auth'),
  storyRouter = require('./routes/stories'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  connectDB = require('./database/atlas'),
  PORT = process.env.PORT,
  app = express();

// Body Parser
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
app.use(express.urlencoded({ extended: false }));
// parse application/json, basically parse incoming Request Object as a JSON Object
app.use(json());

// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Morgan Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars Helpers
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require('./helpers/hbs');

// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: { formatDate, truncate, stripTags, editIcon, select },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Sessions (must always be above passport middleware and routes)
app.use(
  session({
    secret: 'Whatever..',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport config
require('./config/passport')(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', viewRouter, authRouter, storyRouter);

// Database
connectDB();

// Server
app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode, on port: ${PORT}`.yellow
      .bold
  )
);
