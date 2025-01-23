const { NUM_OF_QUOTES_PER_PAGE } = require('../config');
const { getAvilableTags } = require('../services/cache');

function getNumOfQuotesForPage(page, numOfQuotes) {
    const currentPageNumberOfQuotes = page * NUM_OF_QUOTES_PER_PAGE;
    if (currentPageNumberOfQuotes <= numOfQuotes) return NUM_OF_QUOTES_PER_PAGE
    return numOfQuotes - currentPageNumberOfQuotes + NUM_OF_QUOTES_PER_PAGE
}

async function getTotalNumberOfPages(numOfQuotes, type = null, filter = null) {
    if (!type || !filter){
        return Math.ceil(numOfQuotes / NUM_OF_QUOTES_PER_PAGE);
    }

    const avilableTags = await getAvilableTags();
    const tag = avilableTags[filter]
    if (!tag) throw new Error('Invalid tag name');
    const { count } = tag;
    
    const totalNumberOfPages = Math.ceil(numOfQuotes / NUM_OF_QUOTES_PER_PAGE);
    const avilableNumberOfPages = Math.ceil(count / NUM_OF_QUOTES_PER_PAGE);
    if(totalNumberOfPages > avilableNumberOfPages) throw new Error('Invalid Number of quotes');
    return totalNumberOfPages
}

module.exports = {
    getNumOfQuotesForPage,
    getTotalNumberOfPages
}