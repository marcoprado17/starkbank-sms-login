_randomString = (length, chars) => {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

getRandomToken = () => {
    return _randomString(6, '0123456789');
}

module.exports = {
    getRandomToken
}
