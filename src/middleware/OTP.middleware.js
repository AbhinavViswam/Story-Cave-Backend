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
            subject: `Your OTP:${otp}`,
            text: `Your OTP for password reset is: ${otp}.
            This code is valid for the next 10 minutes. Please ensure you 
            enter it promptly to complete your transaction or login.
            For your security:
            - Do not share this OTP with anyone.
            - Our team will never ask you for this code.
            If you did not request this OTP or have any concerns, 
            please contact our support team immediately.`
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

module.exports = genOTP