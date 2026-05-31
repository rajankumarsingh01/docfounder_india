const nodemailer =
  require("nodemailer");

const env =
  require("../config/env");

const sendEmail =
  async ({
    to,
    subject,
    html
  }) => {

    const transporter =
      nodemailer.createTransport({

        host:
          env.EMAIL_HOST,

        port:
          env.EMAIL_PORT,

        secure: false,

        auth: {
          user:
            env.EMAIL_USER,

          pass:
            env.EMAIL_PASS
        }
      });

    await transporter.sendMail({
      from: `"DocFinder" <${env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  };

module.exports =
  sendEmail;