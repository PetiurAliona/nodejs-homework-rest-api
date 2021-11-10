const sgMail = require("@sendgrid/mail")
const dotenv = require("dotenv")
const path = require("path")

dotenv.config({ path: path.join(__dirname, "../../.env") })

const { API_KEY } = process.env

async function sendVerificationEmail(email, verificationToken) {
  sgMail.setApiKey(API_KEY)

  return sgMail.send({
    to: email,
    from: "alena.petyur@gmail.com",
    subject: "Please verify your email",
    html: `<a href="http://localhost:3030/api/users/verify/${verificationToken}">Please verify your email</a>`,
  })
}

module.exports = {
  sendVerificationEmail,
}
