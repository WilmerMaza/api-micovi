const { Router } = require("express");
const router = Router();
const { upload, pathDirect } = require("../servicios/subirServicio");
const fs = require("fs");
const path = require("path");

router.post("/upload", upload.array("file"), (req, res) => {
  function saveImagen(file) {
    const newPath = `./uploads${file.orinalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
  }

  res.sendStatus(200);
});

router.get("/lower/:filename", (req, res) => {
  const filename = req.params.filename;
  const fileExtension = path.extname(filename).toLowerCase();
  const carpeta = pathDirect();

  const contentTypeMap = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp", 
  };


  if (contentTypeMap[fileExtension]) {
    res.setHeader("Content-Type", contentTypeMap[fileExtension]);
    res.sendFile(path.join(carpeta, "uploads", filename));
  } else {
    res.status(400).json({ error: "Formato de imagen no admitido" });
  }
});
module.exports = router;
