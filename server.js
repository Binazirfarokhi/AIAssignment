const express = require("express");
const path = require("path");
const pjson = require("./package.json");
const port = ("port", process.env.PORT || 8088);
const app = express();

const cors = require('cors');
app.use(cors());
app.options('*', cors());
app.set('trust proxy', 'loopback, linklocal, uniquelocal')

// Serve static files
const serveStatic = require("serve-static");

// Extract files from form data
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Google cloud library for Vision API
const vision = require("@google-cloud/vision");

// Google cloud client
const client = new vision.ImageAnnotatorClient({
  keyFilename: "keyfile.json"
});

// Image Properties
app.post("/detecttext", upload.single("file"), function (req, res, next) {

  console.log(req.file.path);
  
  console.log("inside")
  client.textDetection(req.file.path).then(results => {
    // send result data
    console.log("myRes->", JSON.stringify(results));
    res.send(results);
  })
    .catch(err => {
      res.status(400).send(err);
      console.log("error->", err);
    });
});


app.use(serveStatic(path.join(__dirname, "public")));
const server = app.listen(port);
console.log(`😁  ${pjson.name} running → PORT ${server.address().port}`);
