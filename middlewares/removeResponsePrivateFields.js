removePrivateFieldsOfObjTree = (obj) => {
    let objKeys = Object.keys(obj);
    let keysToBeRemoved = [];
    for(let i = 0; i < objKeys.length; i++) {
        let key = objKeys[i];
        if(key.length > 1 && key[0] === '_' && key[1] === '_') {
            keysToBeRemoved.push(key);
        }
        else if(obj[key] instanceof Object) {
            removePrivateFieldsOfObjTree(obj[key]);
        }
    }
    keysToBeRemoved.forEach((key) => {
        delete obj[key];
    });
    return false;
}

removeResponsePrivateFieldsMiddleware = (body) => {
    removePrivateFieldsOfObjTree(body);
    return body;
}

module.exports = removeResponsePrivateFieldsMiddleware;
