const { CONFIG, NUM_OF_QUOTES_PER_PAGE } = require('../config');
const { getQuotes } = require('../services/favQsApiService');
const { getTotalNumberOfPages, getNumOfQuotesForPage } = require('../utils');

const filterToEtag = {};
const etagToQuotes = {};

let requestQueue = [];
let isRunning = false;

async function processRequestQueue() {
    if (isRunning || requestQueue.length === 0) return;
    isRunning = true;
    while (requestQueue.length > 0) {
        const { resolve, reject, page, filter, type, etag } = requestQueue.shift();
        try {
            const quotesResults = await getQuotes(page, filter, type, etag);
            resolve(quotesResults);
        } catch (error) {
            reject(error)
        }
        await new Promise((res) => setTimeout(res, CONFIG.TIME_BETWEEN_REQUESTS));
    }
    isRunning = false
}

async function fetchQuotes(page = 1, filter = null, type = null, etag = null) {
    return new Promise((resolve, reject) => {
        requestQueue.push({ resolve, reject, page, filter, type, etag });
        processRequestQueue();
    });
}

async function getFilteredQuotes(page, filter, type) {
    const filterKey = `${filter}_${page}`
    let etag = filterToEtag[filterKey] ? filterToEtag[filterKey] : null;
    try {
        let results = await fetchQuotes(page, filter, type, etag);
        filterToEtag[filterKey] = results.headers.etag;
        etagToQuotes[results.headers.etag] = results.data;
        return results;
    } catch (err) {
        if (err.status === 304) return { data: etagToQuotes[etag] }
    }
}


async function getRandomQuotesAll(numOfQuotes) {
    console.log('getRandomQuotesAll', numOfQuotes)
    try {
        const totalNumberOfPages = await getTotalNumberOfPages(numOfQuotes);
        const quotesResults = [];
        for (let page = 1; page <= totalNumberOfPages; page++) {
            const numberOfQuotesforPage = getNumOfQuotesForPage(page, numOfQuotes)
            const results = await fetchQuotes();
            const quotes = results.data.quotes.length === numberOfQuotesforPage ? results.data.quotes : results.data.quotes.splice(0, numberOfQuotesforPage);
            quotesResults.push(...quotes);
        }
        return quotesResults;
    } catch (error) {
        throw error
    }
}
async function getPaginatedRandomQuotes(numOfQuotes, page, filter = null, type = null) {
    try {
        const totalNumberOfPages = await getTotalNumberOfPages(numOfQuotes, type, filter);
        const numberOfQuotesforPage = getNumOfQuotesForPage(page, numOfQuotes)
        const results = filter ? await getFilteredQuotes(page, filter, type) : await fetchQuotes();
        const quotes = results.data.quotes.length === numberOfQuotesforPage ? results.data.quotes : results.data.quotes.splice(0, numberOfQuotesforPage);
        return {
            quotes,
            totalNumberOfPages: totalNumberOfPages,
            numOfQuotesPerPage: NUM_OF_QUOTES_PER_PAGE
        }
    } catch (error) {
        throw error
    }
}

async function getRandomQuotes(numOfQuotes, page, filter = null, type = null) {
    try {
        if(page) return await getPaginatedRandomQuotes(numOfQuotes, page, filter, type);
        return await getRandomQuotesAll(numOfQuotes);
    } catch (error) {
        throw error
    }
}

module.exports = {
    getRandomQuotes
}