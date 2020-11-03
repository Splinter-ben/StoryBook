require('colors');
const { json } = require('express');

const express = require('express'),
  exphbs = require('express-handlebars'),
  morgan = require('morgan'),
  connectDB = require('./database/atlas'),
  router = require('./routes/index'),
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

// Routes
app.use('/', router);

// Database
connectDB();

// Server
const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode, on port: ${PORT}`.yellow
      .bold
  )
);
