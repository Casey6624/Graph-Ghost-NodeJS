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
// GraphQL Resolvers and Schema
const graphqlResolvers = require("./graphql/resolvers/index");
const graphqlSchema = require("./graphql/schema/index");

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

mongoose
  .connect(`<PASTE YOUR MONGODB ATLAS CONNECTION STRING HERE>`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
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
