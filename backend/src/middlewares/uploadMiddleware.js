import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    if (file.fieldname === "cvFile") {
      uploadPath = "uploads/researcher/cv";
    } else if (file.fieldname === "transcript") {
      uploadPath = "uploads/researcher/transcripts";
    } else {
      uploadPath = "uploads";
    }

    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });
