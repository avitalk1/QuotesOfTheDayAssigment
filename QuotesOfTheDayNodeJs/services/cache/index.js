const { getTypehead } = require('../favQsApiService');

const avilableTags = {};

async function getAvilableTags(){
    if(!Object.keys(avilableTags).length) await loadAvialbleTagsCache();
    return avilableTags;
}

function normalizeTags(tags){
    for (const tag of tags) {
        avilableTags[tag.name] = tag;
    }
}

async function loadAvialbleTagsCache(){
    const typeheadResult = await getTypehead();
    normalizeTags(typeheadResult.data.tags);
}

module.exports = {
    loadAvialbleTagsCache,
    getAvilableTags
}