const nodemailer = require('nodemailer');

module.exports = app => {
  const {
    host,
    port,
    secure,
    user,
    pass,
  } = app.config.robotEmail;

  app.mailer = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};
