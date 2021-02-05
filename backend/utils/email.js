const nodemailer = require("nodemailer");
const config = require("../config");

const sendEmail = async (options) => {
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

  const htmlTemplate = ` <!doctype html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body style="font-family: sans-serif;">
      <div style="display: block; margin: auto; max-width: 600px;" class="main">
      <img alt="Inspect with Tabs" src="https://edenik.com/assets/images/quiz%20app.png" style="width: 100%;">
        ${options.message}
        <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Best regards, QUIZ APP</h1>
      </div>
    </body>
  </html>`;

  const mailOptions = {
    from: `QuizApp <${config.nodemailer.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
