const { SportsInstitutions } = require("../../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Agregar módulo fs para trabajar con el sistema de archivos

const nameInstitution = "nombreInicial-institucion";

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      // Directorio base para las carpetas de los usuarios
      const baseDirectory = path.join(__dirname, "../..", "uploads");

      // Crear un directorio con el nombre de la institución si no existe
      const userDirectory = path.join(baseDirectory, nameInstitution);

      if (!fs.existsSync(userDirectory)) {
        fs.mkdirSync(userDirectory);
      }

      cb(null, userDirectory);
    } catch (error) {
      console.error("Error en la función destination: ", error);
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadRegister = multer({ storage: storage });
const contentTypeMap = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

const pathDirect = () => {
    try {
      const directorioUploads = path.join(__dirname, "../..", "uploads");
  
      return directorioUploads;
    } catch (error) {
      throw new Error(error);
    }
};

async function handleImageRequestRegister(req, res) {
  const filename = req.params.filename;
  const fileExtension = path.extname(filename).toLowerCase();
  const carpeta = pathDirect();
  if (contentTypeMap[fileExtension]) {
    res.setHeader("Content-Type", contentTypeMap[fileExtension]);
    res.sendFile(path.join(carpeta, nameInstitution, filename));
  } else {
    res.status(400).json({ error: "Formato de imagen no admitido" });
  }
}

module.exports = { uploadRegister, handleImageRequestRegister };
