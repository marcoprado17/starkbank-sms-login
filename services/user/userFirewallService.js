let nAttempts = 0;

onUserLoginFailAttempt = (req) => {
    return new Promise((resolve, reject) => {
        nAttempts++;
        resolve(nAttempts)
        // TODO: Persistir no redis
    });
}

reqIpOk = (req) => {
    return new Promise((resolve, reject) => {
        if(nAttempts >= 10) {
            let err = new Error("Ip xxx exceded the number of attempt. You can try again in x second(s).");
            err.code = "IP_BLOCKED";
            reject(err);
        }
        else {
            resolve(req);
        }
    })
}

module.exports = {
    onUserLoginFailAttempt,
    reqIpOk
};
