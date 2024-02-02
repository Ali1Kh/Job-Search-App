import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, html }) => {
  let user = process.env.EMAIL;
  let pass = process.env.EMAIL_APP_KEY;
  const mailtransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: { user, pass },
  });

  const sendMail = await mailtransporter.sendMail({
    from: `"Job Search App" ${user}`,
    to,
    subject,
    html,
  });

  if (sendMail.accepted.length > 0) return true;
  return false;
};