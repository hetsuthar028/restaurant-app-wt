const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuid4 } = require('uuid');
const fs = require('fs');

// Firebase
const { ref, getStorage, uploadBytes, getDownloadURL } = require('firebase/storage');
const firebaseConfig = require('../../FirebaseConfig');
const firebaseApp = require('firebase/app');
firebaseApp.initializeApp(firebaseConfig);
const storage = getStorage();

const metadata = {
    contentType: 'image/jpeg',
};


const uploadImageRouter = express.Router();

const storageMulter = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb) {
        cb(null, uuid4() + path.extname(file.originalname));
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const uploader = multer({
    storage: storageMulter,
})

uploadImageRouter.get('/', (req, res) => {
    res.send("HELLO FROM UPLOAD ROUTER");
})

uploadImageRouter.post('/cache', uploader.array('itemImage', 7), (req, res) => {
    console.log("GOT POST REQ")
    try {
        if(!req.files){
            return res.status(400).send({success: false, message: "Invalid image data"});
        }

        console.log(req.files);
        return res.status(201).send({success: true, filesNames: req.files.map((f) => f.filename)})
    } catch (error) {
        console.log("Error::", error);
        return res.status(400).send({success: false, message: "Could not upload the file"});
    }
});


uploadImageRouter.post('/bucket', (req, res) => {
    try {
        let { files, location } = req.body;
        let fileURLs = [];

        console.log("FILES", files);

        files.map(async (fileName, idx) => {
            const storageRef = ref(storage, `${location}/${uuid4()}.png`);
            let fileData = fs.readFileSync(`uploads/${fileName}`);
            
            await uploadBytes(storageRef, fileData, metadata)
                .then(async (snapshot) => {
                    await getDownloadURL(storageRef).then((url) => {
                        // fileURLs[fileName] = url;
                        fileURLs.push(url);
                    })
                    .catch((downloadErr) => {
                        console.log("Error getting download url:", downloadErr);
                    })
                })
                .catch((uploadErr) => {
                    console.log("Error uploading image:", uploadErr);
                })
            if(Object.keys(fileURLs).length === files.length){
                console.log("REturning", fileURLs);
                return res.status(201).send({success: true, fileURLs});
            }
        })

    } catch (error) {
        console.log("Error::", error);
        return res.status(400).send({success: false, message: "Could not upload the file"});
    }
})

module.exports = uploadImageRouter;