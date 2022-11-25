const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const { fork } = require("child_process");
const { getDataInStream } = require("./nodeWIthStream");

const PORT = process.env.PORT || 8080

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  const app = require("express")();

  app.get("/calculate-with-agg", (req, res) => {
    const forked = fork("nodeWithAggregation.js");
    forked.send({});

    forked.on("message", (msg) => {
      res.send(msg);
    });
  });

  app.get("/calculate-without-agg", (req, res) => {
    const forked = fork("nodeWithoutAggregation.js");
    forked.send({});

    forked.on("message", (msg) => {
      res.send(msg);
    });
  });

  app.get("/calculate-with-stream", getDataInStream);

  app.listen(PORT, () => console.log("Listening on "+PORT));
}