const { Conflict, Unauthorized, BadRequest, NotFound } = require("http-errors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")

const User = require("./users.model")
const { sendVerificationEmail } = require("../services/verify.email")

async function signUp({ email, password }, userFile) {
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Conflict(`This '${email}' in use`)
  }

  const hashPassword = await bcrypt.hash(password, 2)

  const newUser = await User.create({
    email: email,
    password: hashPassword,
    avatarURL: userFile.filename,
    verifyToken: uuidv4(),
  })

  await sendVerificationEmail(email, newUser.verifyToken)

  return newUser
}

async function signIn({ email, password }) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Unauthorized("Email or password is wrong")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Unauthorized("Email or password is wrong")
  }

  if (!user.verify) {
    throw new Unauthorized("User is not verified")
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
  await User.findByIdAndUpdate(user._id, { token })

  return { user, token }
}

async function logOut(user) {
  await User.findByIdAndUpdate(user._id, { token: null })
}

async function updateAvatarUser(user, updateParams) {
  if (!updateParams) {
    throw new BadRequest("No file")
  }
  return await User.findByIdAndUpdate(user._id, { avatarURL: updateParams.filename }, { new: true })
}

async function verificationToken({ verifyToken }) {
  const user = await User.findOne({ verifyToken })

  if (!user) {
    throw new NotFound("User not found")
  }

  await User.findByIdAndUpdate(user._id, {
    verifyToken: null,
    verify: true,
  })
}

async function sendRepeatedVerifyEmail({ email }) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFound("User not found")
  }

  if (user.verify) {
    throw new BadRequest("Verification has already been passed")
  }

  await sendVerificationEmail(email, user.verifyToken)
}

module.exports = {
  signUp,
  signIn,
  logOut,
  updateAvatarUser,
  verificationToken,
  sendRepeatedVerifyEmail,
}
