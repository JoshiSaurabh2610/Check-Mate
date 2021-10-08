const crypto = require('crypto');
const HashService = require('./Hash-service');


const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require('twilio')(smsSid,smsAuthToken,{
    lazyLoading:true
});

class OtpService{
    async generateOtp(){
        const OTP = crypto.randomInt(1000,9999);
        return OTP;
    }

    async sendBySMS(toPhone,OTP){
        return await twilio.messages.create({
            to: toPhone,
            from: process.env.SMS_FROM_NUmber,
            body: `Your Coder's House OTP(One Time Password) is ${OTP}. This Verification Code is valid for 2 minutes only`,
        })
    }

    verifyOtp(hashedOtp,data){
        let hash = HashService.hashOtp(data);
        return hashedOtp === hash;
    }
}

module.exports = new OtpService();