const { Conflict, Unauthorized } = require("http-errors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

var gravatar = require("gravatar")

const User = require("./users.model")

async function signUp({ email, password }) {
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Conflict(`This '${email}' in use`)
  }

  const hashPassword = await bcrypt.hash(password, 2)

  const url = gravatar.url(email, {
    s: "200",
    r: "pg",
    d: "mp",
  })

  const newUser = await User.create({
    email: email,
    password: hashPassword,
    avatarURL: url,
  })

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

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
  await User.findByIdAndUpdate(user._id, { token })

  return { user, token }
}

async function logOut(user) {
  await User.findByIdAndUpdate(user._id, { token: null })
}

async function updateAvatarUser(user, updateParams) {
  await User.findByIdAndUpdate(user._id, { avatarURL: updateParams.path })
}

module.exports = {
  signUp,
  signIn,
  logOut,
  updateAvatarUser,
}
