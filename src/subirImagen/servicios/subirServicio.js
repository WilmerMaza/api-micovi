const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.join(__dirname, '../..', 'uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const pathDirect = () => {
  try {
    const directorioUploads = path.resolve(__dirname, '../..');

    return directorioUploads;
  } catch (error) {
    throw new Error(error);
  }

};

const upload = multer({ storage: storage });

const contentTypeMap = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};


function handleImageRequest(req, res) {
  const filename = req.params.filename;
  const fileExtension = path.extname(filename).toLowerCase();
  const carpeta = pathDirect(); 
  if (contentTypeMap[fileExtension]) {
    res.setHeader("Content-Type", contentTypeMap[fileExtension]);
    res.sendFile(path.join(carpeta, "uploads", filename));
  } else {
    res.status(400).json({ error: "Formato de imagen no admitido" });
  }
}

module.exports = { upload, pathDirect,handleImageRequest};
