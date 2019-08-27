// Main entry point for my app
const { getRawHTML } = require("./helpers/scrape_url");

async function startApp() {
    console.log(await getRawHTML())
}

startApp()