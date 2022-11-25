const { connect } = require("./db");

process.on("message", async () => {
  const fact = await aggregate();
  process.send(fact);
  process.exit();
});

async function aggregate() {
  const { client, coll } = await connect();
  const cursor = coll.find({
    'startDateTime': {
      '$gte': '1567276200000'
    },
    'endDateTime': {
      '$lte': '1569868199000'
    }
  }, {
    '_id': 0,
    'resourceID': 1,
    'timeSpent': 1,
    'startDateTime': 1,
    'endDateTime': 1
  });

  const result = await cursor.toArray();

  await client.close();

  // here we'll do all the operations for aggregation
  const dataWithTime = {};
  result.forEach(r => {
    if (!dataWithTime.hasOwnProperty(r.resourceID)) {
      dataWithTime[r.resourceID] = [r.timeSpent];
      return;
    }
    dataWithTime[r.resourceID].push(r.timeSpent);
  });

  for (const key in dataWithTime) {
    let totalTimeSpent = dataWithTime[key].reduce((prev, curr) => +prev + +curr);
    dataWithTime[key] = "" + totalTimeSpent;
  }

  return dataWithTime;
}