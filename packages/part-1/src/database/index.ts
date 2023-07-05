import { Db, MongoClient } from 'mongodb';
import databaseConfig from './_config';

let clientConnection: MongoClient;
let database: Db;
const defaultDB = databaseConfig.credentials.database;

const useMongo = () => {
  if (!clientConnection) {
    // Enable command monitoring for debugging
    clientConnection = new MongoClient(databaseConfig.connectionString, {
      maxPoolSize: 10,
    });

    clientConnection.on('commandStarted', (started) => console.log(started));
    database = clientConnection.db(defaultDB);
  }
  return {
    connection: clientConnection,
    db: database,
  };
};

export default useMongo;
