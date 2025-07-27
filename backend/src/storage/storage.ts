import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
  destination: function (req, file, cb) {
    cb(null, "src/uploads/");
  },
});
const upload = multer({ storage: storage });
export default upload;
