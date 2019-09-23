// Libraries
const chalk = require("chalk");
const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const app = express();
app.use(bodyParser.json());
// Constants
const PORT = 4500;
// Helper Functions
const { getRawHTML, crawlWebpage } = require("./helpers/scrape_url");
// GraphQL Resolvers and Schema
const graphqlResolvers = require("./graphql/resolvers/index");
const graphqlSchema = require("./graphql/schema/index");

// Combat CORS errors
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

app.listen(PORT);

console.log(chalk.magenta(`Server Listening On PORT: ${PORT}`));
