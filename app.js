const chalk = require('chalk'); 

// Main entry point for my app
const { getRawHTML, crawlWebpage } = require("./helpers/scrape_url");

async function startApp() {
  crawlWebpage(await getRawHTML());
  console.log(chalk.magenta("Recieved HTML"))
}

startApp();
