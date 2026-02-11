const uploadDir = path.resolve("uploads"); // Absolute path
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const uploadStorage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: uploadStorage });