const requestIp = require('request-ip');
const redisClient = require('../../database/redisdb');
const configs = require('../../configs');

getRedisKeyOfClientIp = (clientIp) => {
    return `ipLoginAttempt_${clientIp}`;
}

onUserLoginFailAttempt = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const clientIp = requestIp.getClientIp(req);
            const clientIpRedisKey = getRedisKeyOfClientIp(clientIp);
            const currIpAttempAsString = await redisClient.get(clientIpRedisKey);
            let currIpAttemptBeforeInc = Number.parseInt(currIpAttempAsString);
            if(currIpAttempAsString === null) {
                console.log(`Creating redis key: ${clientIpRedisKey}`);
                await redisClient.set(clientIpRedisKey, 1, 'EX', configs.timeToResetIpsInSeconds);
                currIpAttemptBeforeInc = 0;
            }
            else {
                console.log(`Incrementing redis key: ${clientIpRedisKey}`);
                await redisClient.incr(clientIpRedisKey);
            }
            const nAttempts = currIpAttemptBeforeInc+1;
            const nIpAttemptsBeforeBlockingIt = configs.nIpAttemptsBeforeBlockingIt;
            const ttl = await redisClient.ttl(clientIpRedisKey);
            resolve({nAttempts, nIpAttemptsBeforeBlockingIt, ttl});
        }
        catch(err) {
            reject(err);
        }
    });
}

reqIpOk = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const clientIp = requestIp.getClientIp(req);
            const clientIpRedisKey = getRedisKeyOfClientIp(clientIp);
            const ttl = await redisClient.ttl(clientIpRedisKey);
            const currIpAttempAsString = await redisClient.get(clientIpRedisKey);
            const currIpAttempt = Number.parseInt(currIpAttempAsString);
            console.log("reqIpOk.ttl:", ttl);
            console.log("reqIpOk.currIpAttempt:", currIpAttempt);
            if(ttl > 0 && currIpAttempt >= configs.nIpAttemptsBeforeBlockingIt) {
                let err = new Error(`Ip ${clientIp} exceded the number of attempts. You can try again in ${ttl} second(s).`);
                err.code = "IP_BLOCKED";
                reject(err);
            }
            else {
                resolve(req);
            }
        }
        catch(err) {
            reject(err);
        }
    })
}

module.exports = {
    onUserLoginFailAttempt,
    reqIpOk
};
