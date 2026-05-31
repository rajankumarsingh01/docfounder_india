const { Resend } = require("resend");
const env = require("../config/env");

const resend = new Resend(env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  const { error } = await resend.emails.send({
    from: "DocFinder <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("❌ Resend error:", error);
    throw new Error(error.message);
  }

  console.log("✅ Email sent to:", to);
};

module.exports = sendEmail;