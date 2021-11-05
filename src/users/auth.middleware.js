const jwt = require("jsonwebtoken")
const { Unauthorized } = require("http-errors")
const Jimp = require("jimp")
const path = require("path")
const FsPromises = require("fs").promises

const User = require("./users.model")

const STATIC_DIR = path.join(__dirname, "../public/avatars")

exports.authorize = async function authorize(req, res, next) {
  try {
    const authHeader = req.get("Authorization")
    if (!authHeader) {
      throw new Unauthorized()
    }

    const token = authHeader.replace("Bearer ", "")

    const { userId } = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(userId)
    if (!user) {
      throw new Unauthorized()
    }

    req.user = user

    next()
  } catch (err) {
    next(new Unauthorized())
  }
}

exports.compressImage = () => {
  return async (req, res, next) => {
    const draftFilePath = req.file.path
    const file = await Jimp.read(draftFilePath)
    const compressedPath = path.join(STATIC_DIR, req.file.filename)

    await file.resize(250, 250).writeAsync(compressedPath)

    await FsPromises.unlink(draftFilePath)

    req.file.destination = STATIC_DIR
    req.file.path = compressedPath

    next()
  }
}
