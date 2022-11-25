const {getDataInStream} = require("./nodeWIthStream");
const {aggregate} = require("./nodeWithAggregation");
const {withoutAggregate} = require("./nodeWithoutAggregation");

const PORT = process.env.PORT || 8080

const app = require("express")();

app.get("/", (req, res) => {
    res.json({
        msg: "working",
    });
});

app.get("/calculate-with-agg", aggregate);

app.get("/calculate-without-agg", withoutAggregate);

app.get("/calculate-with-stream", getDataInStream);

app.listen(PORT, () => console.log("Listening on " + PORT));