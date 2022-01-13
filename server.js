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
app.get("/", express.static(path.join(__dirname)));

app.post('/detect',(req,res)=>{
     const {spawn}=require('child_process');
     const algo=req.body.model;
     console.log(algo);
     let py="";
     if(algo=="SVM_SPIRAL"){
      py=spawn('python',['spiral_svm.py']);
     }else if(algo=="SVM_WAVE"){
        py=spawn('python',['wave_svm.py']);
     }else if(algo=="RF_SPIRAL"){
        py=spawn('python',['spiral_RF.py']);
     }else if(algo=="RF_WAVE"){
        py=spawn('python',['wave_RF.py']);
     }else if(algo=="KNN_SPIRAL"){
        py=spawn('python',['spiral_KNN.py']);
     }else{
        py=spawn('python',['wave_KNN.py']);
     }

 py.stdout.on('data',(data)=>{
     res.send(data.toString());
     console.log(data.toString());
 })

 py.on('close',(code)=>{
     console.log(`child process exited with code ${code}`);
 })
 });



const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/path/to/temporary/directory/to/store/uploaded/files"
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
          .sendFile(path.join(__dirname, "detect.html"));
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

