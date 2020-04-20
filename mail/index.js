const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USR,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = {
  sendNow: function(
    recipient = "caseyrsmith43@gmail.com",
    retrivelCode = "sssd",
    codeId = "ssss",
    userId = "sssd"
  ) {
    let emailBody = `
        Hey There,
        
        You recently created a new Graph Ghost API. Your unique retrieval code is:

        ---------------------
            ${retrivelCode}
        ---------------------

        you can also bookmark the link below, for easy retrieval in the future.

        https://graphghost.co.uk/code/?codeId=${codeId}&creatorId=${userId}

        Thanks for using Graph Ghost!

        From The Graph Ghost Team 👻
        `;

    var mailOptions = {
      from: process.env.EMAIL_USR,
      to: recipient,
      subject: `New API Created! | Graph Ghost`,
      text: emailBody
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};
