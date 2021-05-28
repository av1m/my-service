import {connect} from 'mongoose';
import dotenv = require('dotenv');

dotenv.config();
console.log(process.env);

export default {
  jwtSecret: process.env.JWT_SECRET || 'TEST',
};

export const InitiateMongoServer = async () => {
  const MONGOURI = `mongodb+srv://${process.env.DB_CREDENTIALS}`;

  try {
    await connect(MONGOURI, {
      dbName: 'myservice',
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
      .then(() => console.log('Connected to the database! 🎉'))
      .catch(() => console.log("Can't connect to the database ❌"));
  } catch (e) {
    console.log(e);
    throw e;
  }
};
