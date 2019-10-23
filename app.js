// Libraries
const chalk = require("chalk");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const graphqlHttp = require("express-graphql");
const app = express();
app.use(bodyParser.json());
// Constants
const NODE_PORT = 4500;
const MONGO_PORT = 4501;
// Helper Functions
const { getRawHTML, crawlWebpage } = require("./helpers/scrape_url");
// GraphQL Resolvers and Schema
const graphqlResolvers = require("./graphql/resolvers/index");
const graphqlSchema = require("./graphql/schema/index");
// Models
const Code = require("./models/Code");

// Middleware to combat CORS errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// use defined schemas and resolvers
app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
  })
);

async function startApp(url, elements) {
  console.log(chalk.magenta.bgRed.bold("Getting HTML"));
  return crawlWebpage(getRawHTML(url));
}

app.post("/codeSubmit", async (req, res, next) => {
  const code = new Code({
    generatedCode: JSON.stringify(...req.body),
    retrievalCode: "123",
    creator: "5d88bdea24f2aa181c649cd1"
  });
  const result = await code.save();
  const { _id: codeId } = result;
  return res.json({ codeId: codeId, creatorId: "5d88bdea24f2aa181c649cd1" });
});

//startApp();

app.post("/crawlme", (req, res, next) => {
  const { elements, url } = req.query;
  if (!elements || !url) {
    res.sendStatus(400);
  }
  const data = startApp(url, elements)
    .then(data => {
      console.log(data);
      return res.send(data);
    })
    .catch(err => console.log(err));
  console.log(data);
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphghost-966hz.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(MONGO_PORT);
    console.log("Successfully Connected.");
    console.log(chalk.yellow(`Mongoose Listening On PORT: ${MONGO_PORT}`));
  })
  .catch(err => {
    console.log(`Ooops! Error: ${err}`);
  });

app.listen(NODE_PORT);

console.log(chalk.magenta(`NodeJS Listening On PORT: ${NODE_PORT}`));
