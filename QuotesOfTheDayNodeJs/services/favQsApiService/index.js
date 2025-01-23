const { default: axios } = require('axios');
const { RateLimiterMemory } = require('rate-limiter-flexible');
require('dotenv').config();

const { FAVQS_BASE_URL, CONFIG } = require('../../config');

const rateLimiter = new RateLimiterMemory({
    points: CONFIG.RATE_LIMIT,
    duration: CONFIG.MAX_TIME_IN_SECONDS,
}); 

const headers = {
    'Authorization': `Token token="${process.env.FAVQS_API_KEY}"`,
}

async function getTypehead() {
    try {
        await rateLimiter.consume(1);
        return axios.get(`${FAVQS_BASE_URL}/typeahead`, {
            headers
        });
    } catch (error) {
        console.log('Rate limit exceeded. Try again later.');
    }
    
}

async function getQuotes(page = 1, filter = null, type = 'tags', etag = null) {
    try{
        const params = { page }
        if (filter && type) {
            params['filter'] = filter;
            params['type'] = type;
        }
        if(etag) {
            headers['If-None-Match'] = etag;
        }
        await rateLimiter.consume(1);
        return axios.get(`${FAVQS_BASE_URL}/quotes`, {
            headers,
            params
        });
    }
    catch (error) {
        console.log('Rate limit exceeded. Try again later.');
    }
    
}

module.exports = {
    getTypehead,
    getQuotes
}