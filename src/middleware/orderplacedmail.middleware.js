const nodemailer = require('nodemailer');
const Orders=require("../models/order.models.js")

async function OrderConfirmMail(email,orderid) {

    const order = await Orders.findById(orderid)
    .populate('items.productid', 'name') 
    .populate('userid', 'fullName');      

const amount = order.totalAmount;


const productNames = order.items.map(item => item.productid.name);
const productNamesString = productNames.join(', ');
const userFullName = order.userid.fullName;


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_PASSCODE
        }
    });

    const sendConfirmEmail = (email,orderid,amount,productNamesString,userFullName) => {
        const mailOptions = {
            from: process.env.GMAIL_ID,
            to: email,
            subject: `Order Placed`,
            text: `Dear ${userFullName}
            Order placed successfully for ${productNamesString}.
            Your Order ID is : ${orderid} and total amount is \$${amount}.`
        };

        return transporter.sendMail(mailOptions);
    };

    await sendConfirmEmail(email, orderid,amount,productNamesString,userFullName)
}

module.exports = OrderConfirmMail