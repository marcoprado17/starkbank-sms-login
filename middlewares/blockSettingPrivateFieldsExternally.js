objTreeHasPrivateField = (obj) => {
    let objKeys = Object.keys(obj);
    for(let i = 0; i < objKeys.length; i++) {
        let key = objKeys[i];
        if(key.length > 0 && key[0] === '_') {
            return true;
        }
        else if(obj[key] instanceof Object) {
            let subObjhasPrivateField = objTreeHasPrivateField(obj[key]);
            if(subObjhasPrivateField) {
                return true;
            }
        }
    }
    return false;
}

blockSettingPrivateFieldsExternallyMiddleware = (req, res, next) => {
    blockMethods = ['POST', 'PUT', 'PATCH'];
    if(blockMethods.indexOf(req.method) !== -1 && objTreeHasPrivateField(req.body)) {
        res
            .status(400)
            .json({
                "error": "Variables that start with '_' can't be setted externally"
            });
    }
    else {
        next();
    }
}

module.exports = blockSettingPrivateFieldsExternallyMiddleware;
