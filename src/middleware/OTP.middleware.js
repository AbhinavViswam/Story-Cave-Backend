const nodemailer = require('nodemailer');
const crypto = require('crypto');

async function genOTP(email) {
    let OTP = {}

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_PASSCODE
        }
    });

    const sendOTPEmail = (email, otp) => {
        const mailOptions = {
            from: process.env.GMAIL_ID,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        };

        return transporter.sendMail(mailOptions);
    };

    const generateOTP = () => {
        return crypto.randomInt(100000, 999999);
    };

    const otpGenerated = generateOTP()
    OTP[email] = otpGenerated;
    await sendOTPEmail(email, otpGenerated)
    return OTP[email]
}

module.exports=genOTP