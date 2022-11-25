const { connect } = require("./db");

process.on("message", async () => {
  const fact = await aggregate();
  process.send(fact);
  process.exit();
});

async function aggregate() {
  const agg = [
    {
      '$match': {
        'startDateTime': {
          '$gte': '1567276200000'
        },
        'endDateTime': {
          '$lte': '1569868199000'
        }
      }
    }, {
      '$group': {
        '_id': '$resourceID',
        'totalTime': {
          '$sum': {
            '$toDecimal': '$timeSpent'
          }
        }
      }
    },
  ];

  const { client, coll } = await connect();
  const cursor = coll.aggregate(agg);
  const result = await cursor.toArray();

  await client.close();

  return result;
}
