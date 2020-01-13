// Libraries
const chalk = require("chalk");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const graphqlHttp = require("express-graphql");
const app = express();
// Constants
const NODE_PORT = 4500;
const MONGO_PORT = 4501;
// Helper Functions
const { getRawHTML, crawlWebpage } = require("./helpers/scrape_url");
// GraphQL Resolvers and Schema
const graphqlResolvers = require("./graphql/resolvers/resolvers");
const graphqlSchema = require("./graphql/schema/schema");

const CodeController = require("./controllers/CodeController");

app.use(bodyParser.json());

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

app.use("/code-submit", CodeController.submitCode);

/* async function startApp(url, elements) {
  console.log(chalk.magenta.bgRed.bold("Getting HTML"));
  return crawlWebpage(getRawHTML(url));
} */

//app.post("/submit-code", () => Routes.submitCode);

app.post("/crawl-me", CodeController.crawlMe);

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
