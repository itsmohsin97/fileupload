const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();




// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });



const directoryPath = path.join(__dirname, 'uploads');

app.get('/', (req, res) => {
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        let fileLinks = files.map(file => `<a href="/download/${file}">${file}</a>`);
        res.send(fileLinks.join('<br>'));
    });
});

app.get('/download/:file(*)', (req, res) => {
  var filePath = path.join(directoryPath, req.params.file);

  res.download(filePath, req.params.file, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});


//
app.get('/upload', (req, res) => {
    const files = getUploadedFiles();
    res.render('index', { files });
});


// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/');
});

// Function to get the list of uploaded files
function getUploadedFiles() {
    const uploadDirectory = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadDirectory)) {
        return fs.readdirSync(uploadDirectory);
    } else {
        return [];
    }
}

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});