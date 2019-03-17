var nodemailer = require('nodemailer');
const Email = require('email-templates');

const EMAIL_CONFIG = {
  pool: true,
  host: 'smtp.mailer.inet.vn',
  port: 465,
  secure: true,
  auth: {
    user: 'noreply@bobia.vn',
    pass: 'V1sata@2018'
  }
}

var transporter = nodemailer.createTransport(EMAIL_CONFIG);
const email = new Email({
  message: {
    from: 'admin@bobia.vn'
  },
  send: true,
  preview: false,
  transport: transporter
});

exports.sendEmail = function (toEmail, template, params) {
  email.send({
    template: template,
    message: {
      to: toEmail
    },
    locals: params
  }).then(console.log('success na'))
    .catch(function (err) {
      console.error(err)
    });
}