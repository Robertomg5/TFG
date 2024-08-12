const { Router } = require("express");
const router = Router();

//routes
router.get("/", (req, res) =>{
    res.sendFile("./views/index.html")
})

module.exports = router;