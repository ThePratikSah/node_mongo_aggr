const { connect } = require("./db");

async function getDataInStream(req, res) {
  const { client, coll } = await connect();
  const stream = coll.find({
    'startDateTime': {
      '$gte': '1567276200000'
    },
    'endDateTime': {
      '$lte': '1569868199000'
    }
  }).stream();

  stream.on("error", (err) => {
    console.error(err);
  });

  const dataWithTime = {};
  stream.on("data", doc => {
    if (!dataWithTime.hasOwnProperty(doc.resourceID)) {
      dataWithTime[doc.resourceID] = parseInt(doc.timeSpent);
      return;
    }

    const timeSpent = parseInt(dataWithTime[doc.resourceID]);
    dataWithTime[doc.resourceID] = timeSpent + parseInt(doc.timeSpent);
  });

  stream.on("end", async () => {
    await client.close();
    res.send(dataWithTime);
  });
}

module.exports = {
  getDataInStream,
};