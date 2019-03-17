const sendMail = require('./common');

const ACTIVATION_TEMPLATE = 'templates/activation';
const RESET_PASSWORD_TEMPLATE = 'templates/reset-password';

exports.sendActivationLink = function (toEmail, params) {
  sendMail.sendEmail(toEmail, ACTIVATION_TEMPLATE, params);
}

exports.sendResetPasswordLink = function (toEmail, params) {
  sendMail.sendEmail(toEmail, RESET_PASSWORD_TEMPLATE, params);
}

// test send email, will be removed
this.sendActivationLink('ntrang2459@yahoo.com', {name: "Trang"})