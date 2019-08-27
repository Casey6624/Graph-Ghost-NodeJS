const axios = require("axios");
const cheerio = require("cheerio");

async function getRawHTML(url = "http://localhost/ggd/index.html") {
  const { data } = await axios.get(url);
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
