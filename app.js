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
// GraphQL Resolvers and Schema
const graphqlResolvers = require("./graphql/resolvers/resolvers");
const graphqlSchema = require("./graphql/schema/schema");
// RESTful controller for actions which aren't GraphQL related.
const CodeController = require("./controllers/CodeController");
// Middleware to be able to parse the POST body of HTTP requests
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
// RESTful endpoint which inserts a created code form to the database
app.use("/code-submit", CodeController.submitCode);
// RESTful endpoint which inserts a raw crawlCode to the Crawl database
app.post("/crawl-me", CodeController.crawlMe);
// MongoDB Atlas connection string passed mongoose which allows for DB connection
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
