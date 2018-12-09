const assert = require('assert');

assertHasField = (obj, fieldKey, fieldType) => {
    let message = `Obrigatory field missing: field '${fieldKey}' of type ${fieldType}.`;
    assert(fieldKey in obj, message);
    assert(typeof obj[fieldKey] == fieldType, message);
}

module.exports = {
    assertHasField
};
