const { Router } = require("express");
const router = Router();
const { upload,handleImageRequest } = require("../servicios/subirServicio");
const fs = require("fs");
const path = require("path");
router.post("/upload", upload.array("file"), (req, res) => {
   
    if (req.fileValidationError) {
      return res.status(400).json({ error: "Error 400: Solicitud incorrecta" });
    }
  
 
    res.sendStatus(200);
  });
  
router.get("/lower/:filename", handleImageRequest);


 
module.exports = router;
