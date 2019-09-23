const chalk = require("chalk");
const express = require("express");
const PORT = 4500;
const app = express();

// Main entry point for my app
const { getRawHTML, crawlWebpage } = require("./helpers/scrape_url");

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
