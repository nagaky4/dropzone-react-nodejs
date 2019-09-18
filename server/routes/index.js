var express = require("express");
var router = express.Router();
var multer = require("multer");
var sizeOf = require("image-size");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "upload");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

var upload = multer({ storage: storage });

/* GET home page. */
router.get("/", function(req, res, next) {
  res.send("well come this page");
});

router.post("/upload", upload.single("imgUpload"), (req, res) => {
  console.log("req", req.file);
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(422).json({
      error: "this file upload must be an image"
    });
  }
  var dimensions = sizeOf(req.file.path);
  if (dimensions.width < 640 || dimensions.height < 480) {
    return res.status(422).json({
      error: "The image must be at least 640 x 480px"
    });
  }
  return res.status(200).send(req.file);
});

module.exports = router;
