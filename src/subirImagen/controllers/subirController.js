const { Router } = require("express");
const router = Router();
const { upload, handleImageRequest } = require("../servicios/subirServicio");
const { uploadRegister, handleImageRequestRegister} = require("../servicios/subirServicioRegistro");
const fs = require("fs");
const path = require("path");



router.post("/upload", upload.array("file"), (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ error: "Error 400: Solicitud incorrecta" });
  }

  const response = {
    isUpload: true,
    msg: "Your activity was created successfully",
  };
  res.status(200).json(response);
});

router.get("/lower/:filename", handleImageRequest);



router.post("/uploadRegister", uploadRegister.array("file"), (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ error: "Error 400: Solicitud incorrecta" });
  }

  const response = {
    isUpload: true,
    msg: "Your activity was created successfully",
  };
  res.status(200).json(response);
});

router.get("/lowerWithoutFolter/:filename", handleImageRequestRegister);

module.exports = router;
