const router = require("express").Router();
const fs = require('fs');
const error = require('../error');

router.post("/", async (req, res, next) => {
    const currentSemester = req.body.currentSemester + "";
    console.log(currentSemester);
    fs.writeFile('currentSemester.txt', currentSemester, function (err) {
        if (err) return error(err.message);
        return res.status(200).json({ success: true })
    });
});

router.get("/", async (req, res, next) => {
    fs.readFile('currentSemester.txt', 'utf8', function (err, data) {
        if (err) return error(err.message);
        res.status(200).json({ currentSemester: data });
    });
})

module.exports = router;