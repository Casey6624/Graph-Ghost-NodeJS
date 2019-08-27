const axios = require("axios");
const cheerio = require("cheerio");

async function getRawHTML() {
  const { data } = await axios.get("http://localhost/ggd/index.html");
  return data;
}

async function crawlWebpage(fullHTML) {
  const $ = cheerio.load(fullHTML);

  console.log($);
}

module.exports = {
  getRawHTML: getRawHTML,
  crawlWebpage: crawlWebpage
};
