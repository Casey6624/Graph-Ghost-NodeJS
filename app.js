// Main entry point for my app
const { getRawHTML, crawlWebpage } = require("./helpers/scrape_url");

async function startApp() {
  crawlWebpage(await getRawHTML());
}

startApp();
