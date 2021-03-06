const UserSchema = require('../database/schemas/UserSchema');
const apiKey = process.env.SMS_API_KEY;
const axios = require('axios');
const loginUrl = process.env.LOGIN_URL;

sendSmss = async () => {
    console.log("Sending SMSs");
    await UserSchema.find({
        smsSent: false
    })
    .limit(1)
    .then((users) => {
        let pSendAllSmss = [];
        users.forEach((user) => {
            console.log(`user phone number: ${user.normalizedPhoneNumber}`);
            console.debug("user token:", user.token);
            pSendAllSmss.push(new Promise(async (resolve, reject) => {
                try {
                    // TODO: Get a new account on SMS gateway and enable send of SMS
                    r = await axios({
                        method: 'post',
                        url: 'https://sms.comtele.com.br/api/v2/send',
                        data: {
                            sender: 'Marco',
                            content: `Starkbank backend test by Marco. Token: ${user.token}. Login url: ${loginUrl}`,
                            receivers: [`${user.normalizedPhoneNumber}`].join(),
                            timeout: 60000,
                        },
                        headers: {
                            "Content-Type": "application/json",
                            "auth-key": apiKey
                        }
                    });
                    // r = {
                    //     status: 200
                    // };
                    resolve({
                        success: (r.status >= 200 && r.status < 300),
                        userId: user._id
                    });
                }
                catch(err) {
                    console.error(err);
                    resolve({
                        success: false,
                        userId: user._id
                    });
                }
            }));
        });
        return Promise.all(pSendAllSmss);
    })
    .then((sendAllSmssResults) => {
        let pAllUpdates = [];
        sendAllSmssResults.forEach((sendSmsResult) => {
            if(sendSmsResult.success) {
                pAllUpdates.push(new Promise(async (resolve, reject) => {
                    try {
                        await UserSchema.findOneAndUpdate(
                            { _id: sendSmsResult.userId },
                            { $set: { smsSent: true }}
                        );
                        resolve({
                            success: true
                        });
                    }
                    catch(err) {
                        console.error(err);
                        resolve({
                            success: false
                        });
                    }
                }));
            }
        });
        return pAllUpdates;
    })
    .catch((err) => {
        console.log(err);
    })
};

module.exports = sendSmss;
