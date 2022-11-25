const { MongoClient } = require("mongodb");

async function connect() {
  const URI = process.env.URI;
  const DB = process.env.DB;
  const COLLECTION = process.env.COLLECTION;

  const client = await MongoClient.connect(
    URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  const coll = client.db(DB).collection(COLLECTION);

  return {
    client, coll
  };
}

module.exports = {
  connect,
};
