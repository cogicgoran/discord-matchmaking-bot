import { MongoClient, ServerApiVersion } from 'mongodb';
import config from '../config';

let client: MongoClient;

export async function initDatabase() {
  try {
    client = new MongoClient(config.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
  } catch (error) {
    console.log('[DatabaseConnectionError]:', error);
    process.exit(1);
  }
}

export default client!;
