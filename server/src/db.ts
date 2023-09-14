import { Db, MongoClient } from 'mongodb';

const connectionUri = process.env.DB_CONNECTION_URI || '';
const dbName = process.env.DB_NAME || '';

export const client = new MongoClient(connectionUri);
let db: Db;

async function connect() {
  if (!db) {
    try {
      const connection = await client.connect();
      db = connection.db(dbName);

      return db;
    } catch (ex) {
      console.error(ex);
    }
  } else {
    return db;
  }
}

export default connect;
