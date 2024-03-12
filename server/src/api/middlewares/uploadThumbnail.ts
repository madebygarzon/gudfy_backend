//storage sem implementa para guardar el archivo con un numero rando, segun la hora
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});
// upload se implementa para crear un midelware que funcionara como receptor del archivo FromData envido del backend
const upload = multer({ storage });

export default upload;
