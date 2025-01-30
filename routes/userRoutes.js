// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const Logdata = require('../helper/log_file');
const authenticate = require('../middleware/authenticate');
const uploadSingle = require("../middleware/upload");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        return cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/register-user", async (req, res) => {
    try {
        const Result = await userController.createUser(
            req.body.firstName,
            req.body.lastName,
            req.body.userName,
            req.body.email,
            req.body.password,
            req.body.phone,
            req.body.role,
            req.body.about,
            req.body.city,
            req.body.latitude,
            req.body.longitude,
        )
        res.json(Result)
    } catch (error) {
        Logdata.LogFileData(error)
        res.send("Error" + error)
    }
})

router.post("/login-user", async (req, res) => {
    try {
        const Result = await userController.loginUser(
            req.body.email,
            req.body.password,
        )
        res.json(Result)
    } catch (error) {
        Logdata.LogFileData(error)
        res.send("Error" + error)
    }
})

router.get('/get-user-details', authenticate, async (req, res) => {
    try {
        const Result = await userController.getUserDetails(
            req
        );
        res.json(Result);
    } catch (error) {
        var Method = "Geeting Error on (User API(UsersGet))";
        Logdata.LogFileData(err, Method);
        const Result = {
            Data: null,
            StatusMessage: "ERROR",
            Message: err.message
        };
        res.json(Result);
    }
});

router.get('/get-user/:id', authenticate, async (req, res) => {
    try {
        const Result = await userController.getUserById(
            req.params.id
        );
        res.json(Result);
    } catch (error) {
        var Method = "Geeting Error on (User API(getUserById))";
        Logdata.LogFileData(err, Method);
        const Result = {
            Data: null,
            StatusMessage: "ERROR",
            Message: err.message
        };
        res.json(Result);
    }
});

router.post('/update-user', uploadSingle.uploadProfileImage, async (req, res) => {
    try {

        const Result = await userController.updateUser(
            req.body.userId,
            req.body.firstName,
            req.body.lastName,
            req.body.userName,
            req.body.email,
            req.body.phone,
            req.file,
            req.body.role,
            req.body.about,
            req.body.city,
            req.body.latitude,
            req.body.longitude,
        );
        res.json(Result);
    } catch (error) {
        var Method = "Geeting Error on (User API(updateUser))";
        Logdata.LogFileData(error, Method);
        const Result = {
            Data: null,
            StatusMessage: "ERROR",
            Message: error.message
        };
        res.json(Result);
    }
});

router.delete('/delete-user', async (req, res) => {
    try {
        const Result = await userController.deleteUser(
            req.body.userId,
        );
        res.json(Result);
    } catch (error) {
        var Method = "Geeting Error on (User API(deleteUser))";
        Logdata.LogFileData(err, Method);
        const Result = {
            Data: null,
            StatusMessage: "ERROR",
            Message: err.message
        };
        res.json(Result);
    }
});

router.post('/upload-img', upload.single("image"), async (req, res) => {
    try {
        console.log(req.file)
        console.log(req.body)
        const image = req.file ? req.file.filename : null;
        const Result = await userController.uploadImg(
            image
        );
        return Result
    } catch (error) {
        var Method = "Geeting Error on (User API(uploadImg))";
        Logdata.LogFileData(err, Method);
        const Result = {
            Data: null,
            StatusMessage: "ERROR",
            Message: err.message
        };
        res.json(Result);
    }
});



module.exports = router

