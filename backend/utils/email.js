const nodemailer = require("nodemailer");
const config = require("../config");

const sendEmail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    port: 25,
    auth: {
      user: config.nodemailer.EMAIL_USERNAME,
      pass: config.nodemailer.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // define email options

  const mailOptions = {
    from: `QuizApp <${process.env.USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // send email with nodemailer

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
