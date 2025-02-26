const RATE_LIMIT = 30;
const MAX_TIME_IN_SECONDS = 20;
const MAX_TIME_IN_MS = MAX_TIME_IN_SECONDS * 1000;
const CONFIG = {
    RATE_LIMIT,
    MAX_TIME_IN_SECONDS,
    MAX_TIME_IN_MS,
    TIME_BETWEEN_REQUESTS: MAX_TIME_IN_MS / RATE_LIMIT
}

const NUM_OF_QUOTES_PER_PAGE = 25;
const FAVQS_BASE_URL = 'https://favqs.com/api'

module.exports = {
    CONFIG,
    NUM_OF_QUOTES_PER_PAGE,
    FAVQS_BASE_URL
}
