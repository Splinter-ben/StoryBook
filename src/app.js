require('colors');
const { json } = require('express');

const express = require('express'),
  PORT = process.env.PORT,
  app = express();

// Body Parser
app.use(json());

// Server
const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode, on port: ${PORT}`.yellow
      .bold
  )
);
