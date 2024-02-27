const puppeteer = require('puppeteer');

const scrapeAutocomplete = async (searchTerm) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://amazon.com');

  const searchSelector = '#twotabsearchtextbox';
  await page.waitForSelector(searchSelector);
  await page.type(searchSelector, searchTerm);

  // Wait for the autocomplete suggestions to appear
  const autocompleteSelector = '.s-suggestion-container';
  await page.waitForSelector(autocompleteSelector);


  const autocompleteList = await page.evaluate(async (selector) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); //delay for results to be more accurate 
    const suggestions = document.querySelectorAll(selector);
    return Array.from(suggestions, suggestion => suggestion.innerText);
  }, autocompleteSelector);

  
  return autocompleteList;
}


module.exports = {
  scrapeAutocomplete
}
