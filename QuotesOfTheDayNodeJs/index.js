const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { loadAvialbleTagsCache, getAvilableTags } = require('./services/cache/index');
const { getTotalNumberOfPages } = require('./utils');
const { getRandomQuotes } = require('./controller');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

const vlidateRequestParams = async (req, res, next) => {
    const {numOfQuotes, type = null, filter = null } = req.body;
    if ( numOfQuotes < 0) {
        return res.status(400).json({
            success: false,
            message: 'Invliad number of quotes',
        });
    }
    try {
        await getTotalNumberOfPages(numOfQuotes, type, filter);
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
}

app.get('/tags', async (req, res) => {
    try {
        const results = await getAvilableTags();
        res.json(results);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

app.post('/randomQuotes', vlidateRequestParams, async (req, res) => {
    const { numOfQuotes, page = null, type = null, filter = null } = req.body;
    try {
        const results = await getRandomQuotes(numOfQuotes, page, filter, type);
        res.json(results);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

loadAvialbleTagsCache();
