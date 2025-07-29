const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465, 
    secure: true, 
    auth: {
        user: 'arqamking128@gmail.com', 
        pass: 'zdjs igez rrol rqfg'
    }
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: '"LabourLink" <221400044@gift.edu.pk>', 
        to,
        subject, 
        text,
    };

    return transporter.sendMail(mailOptions);
};

const sendMail2 = (to, subject, text) => {
    const mailOptions = {
        from: '"LabourLink" <221400044@gift.edu.pk>', 
        to,
        subject, 
        text,
    };

    return transporter.sendMail2(mailOptions);
};

module.exports = sendMail, sendMail2;