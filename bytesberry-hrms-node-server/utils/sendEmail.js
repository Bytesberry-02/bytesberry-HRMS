const nodemailer = require("nodemailer");
//created from gmail app password using my email address for token which is saved in .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Reminder System" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
