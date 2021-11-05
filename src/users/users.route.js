const express = require("express")
const router = express.Router()

const { upload } = require("../services/multer")

const { validate } = require("../helpers/validate")
const { authorize } = require("./auth.middleware")
const { compressImage } = require("../services/compress")

const { signUp, signIn, logOut, updateAvatarUser } = require("./users.controller")

const { signupSchema, loginSchema } = require("./users.schema")

const { serializeUser, serializeUserWithToken, serializeUserAvatar } = require("./users.serializer")

router.post("/signup", upload.single("avatarURL"), compressImage(), async (req, res, next) => {
  try {
    const newUser = await signUp(req.body, req.file)
    return res.status(201).send(serializeUser(newUser))
  } catch (err) {
    next(err)
  }
})

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const user = await signIn(req.body)
    return res.status(200).send(serializeUserWithToken(user))
  } catch (err) {
    next(err)
  }
})

router.post("/logout", authorize, async (req, res, next) => {
  try {
    const user = await logOut(req.user)
    return res.status(204).send("No Content")
  } catch (err) {
    next(err)
  }
})

router.get("/current", authorize, async (req, res, next) => {
  try {
    return res.status(200).send(serializeUser(req.user))
  } catch (err) {
    next(err)
  }
})

router.patch("/avatars", authorize, upload.single("avatarURL"), compressImage(), async (req, res, next) => {
  try {
    const updateAvatar = await updateAvatarUser(req.user, req.file)
    return res.status(200).send(serializeUserAvatar(updateAvatar))
  } catch (err) {
    next(err)
  }
})

module.exports = router