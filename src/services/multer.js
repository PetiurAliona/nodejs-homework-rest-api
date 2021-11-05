const multer = require("multer")
const path = require("path")

const gravatar = require("gravatar")

const DRAFT_DIR = path.join(__dirname, "../../tmp")

const storage = multer.diskStorage({
  destination: DRAFT_DIR,
  filename: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new BadRequest("Only images allowed"))
    }

    const url = gravatar.url(req.body.email)
    const string = "avatar/"
    const newUrl = url.slice(url.indexOf(string) + string.length)
    console.log(newUrl)
    const ext = path.extname(file.originalname)
    cb(null, `${newUrl}${ext}`)
  },
})

const upload = multer({ storage })

exports.upload = upload
