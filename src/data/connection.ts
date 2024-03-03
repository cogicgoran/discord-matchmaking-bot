import { MongoClient, ServerApiVersion } from 'mongodb';
import config from '../config';

const client = new MongoClient(config.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function initDatabase() {
  try {
    await client.connect();
  } catch (error) {
    console.log('[DatabaseConnectionError]:', error);
    process.exit(1);
  }
}

initDatabase();

export default client;
