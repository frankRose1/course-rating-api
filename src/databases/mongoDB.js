import mongoose from 'mongoose'

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  reconnectTries: Number.MAX_VALUE, // try to reconnect indefinitely
  reconnectInterval: 500, // period between connection attempts in milliseconds
  connectTimeoutMS: 10000, // mongo driver will wait 10 secs to connect before failing
}

const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// successful connection
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB`);
})

// if connection throws an error
mongoose.connection.on('error', err => {
  console.log(`MongoDB connection error ${err}`);
  process.exit(1)
})

// when connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection was disconnected')
})

// If node process ends, close the mongoose connection
process.on('SIGINIT', () => {
  mongoose.connection.close(() => { 
    console.log('MogoDB connection disconnected through app termination'); 
    process.exit(0); 
  }); 
})

/**
 * Connect to MongoDB and wait for a successful connection 
 * before starting the server and listening for requests.
 * @param {Object} server - HTTP server
 * @param {Number} port - Port for the HTTP server
 */
export const connectMongoStartServer = (server, port) => {
  mongoose.connect(MONGO_URI, dbOptions)
    .then(() => {
      server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}...`)
      })
    });
};