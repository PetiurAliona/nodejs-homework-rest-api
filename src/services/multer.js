const multer = require("multer")
const path = require("path")

const DRAFT_DIR = path.join(__dirname, "../../tmp")

const storage = multer.diskStorage({
  destination: DRAFT_DIR,
  filename: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new BadRequest("Only images allowed"))
    }

    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  },
})

exports.storage = storage
