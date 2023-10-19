const { SportsInstitutions } = require("../../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Agregar módulo fs para trabajar con el sistema de archivos

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const nameInstitution = await sportInstitution(req);

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

const sportInstitution = async (req) => {
  try {
    const {
      user: {
        dataUser: { ID, SportsInstitutionID },
      },
    } = req;

    const SportsInstitution =
      SportsInstitutionID === undefined ? ID : SportsInstitutionID;

    const institution = await SportsInstitutions.findOne({
      where: { ID: SportsInstitution },
    });

    if (!institution) {
      throw new Error("La institución no existe");
    }

    const { institutionName } = institution;

    return institutionName;
  } catch (error) {
    throw new Error("Error al consultar Institución: " + error.message);
  }
};

const pathDirect = () => {
  try {
    const directorioUploads = path.join(__dirname, "../..", "uploads");

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

async function handleImageRequest(req, res) {
  const filename = req.params.filename;
  const fileExtension = path.extname(filename).toLowerCase();
  const carpeta = pathDirect();
  const institutionFolder = await sportInstitution(req);
  if (contentTypeMap[fileExtension]) {
    res.setHeader("Content-Type", contentTypeMap[fileExtension]);
    res.sendFile(path.join(carpeta, institutionFolder, filename));
  } else {
    res.status(400).json({ error: "Formato de imagen no admitido" });
  }
}

module.exports = { upload, pathDirect, handleImageRequest,sportInstitution };
