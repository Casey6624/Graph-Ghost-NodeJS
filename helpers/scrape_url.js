const axios = require("axios");
const cheerio = require("cheerio");

async function getRawHTML(url = "http://localhost/ggd/index.html") {
  const { data } = await axios.get(url);
  return data;
}

async function crawlWebpage(fullHTML) {
  const $ = cheerio.load(fullHTML);

  formatTableData($);
}

function formatTableData($) {
  const trimmedItems = [];
  const foundItems = $("td").each(function(i, el) {
    trimmedItems.push($(this).text());
  });
}

module.exports = {
  getRawHTML: getRawHTML,
  crawlWebpage: crawlWebpage
};
