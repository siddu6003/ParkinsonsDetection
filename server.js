const exp=require('express');
const app=exp();
const bodyParser=require('body-parser');
const router=exp.Router();
app.use(bodyParser.urlencoded({
  extended:true
}));

const http = require("http");
const path = require("path");
const fs = require("fs");

const express = require("express");

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8080;

const querystring = require('querystring');

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// put the HTML file containing your form in a directory named "public" (relative to where this script is located)


app.post('/detect',(req,res)=>{
    res.send("success");
 });



const multer = require("multer");


const upload = multer({
  dest: __dirname+"/public/images"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
})
app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/image.png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .sendFile(path.join(__dirname, "/detect.html"));
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

app.get("/image.png", (req, res) => {
    res.sendFile(path.join(__dirname, "./uploads/image.png"));
  });

