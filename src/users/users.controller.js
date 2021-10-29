const { Conflict, Unauthorized } = require("http-errors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("./users.model")

async function signUp({ email, password }) {
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Conflict(`This '${email}' in use`)
  }

  const hashPassword = await bcrypt.hash(password, 2)

  const newUser = await User.create({
    email: email,
    password: hashPassword,
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

module.exports = {
  signUp,
  signIn,
  logOut,
}
