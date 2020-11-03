const mongoose = require('mongoose'),
  host = process.env.DB_HOST_ATLAS,
  password = process.env.DB_PASSWORD,
  bdd = process.env.DB_NAME;

// Atlas mongoDB
const URL = `mongodb+srv://${host}:${password}@mongocluster-h3gqv.mongodb.net/${bdd}?retryWrites=true&w=majority`;

const connectDB = async () => {
  const conn = await mongoose.connect((mongo_uri = URL), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;