
const checkEmailSet = (req, res, next) => {
    const email = req.cookies.emailResetPassword;
    if (!email) {
        return res.redirect('/users/forgot-password');
    }
    next();
};


const checkOtpSet = (req, res, next) => {
    const otp = req.cookies.otp;
    if (!otp) {
        return res.redirect('/users/verify-otp');
    }
    next();
};

module.exports={checkEmailSet,checkOtpSet}