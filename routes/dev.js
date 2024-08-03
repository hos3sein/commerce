const express = require("express");

const C = require("../controllers/dev");

const router = express.Router();
const {protect}=require("../middleware/auth")

// POST
router.post("/createperm", C.createPerm);

router.get("/dellall", C.delAll);
router.get("/all", C.all);
router.get("/delb/:id", C.delB);


router.delete("/deleteorder/:id",protect,C.deleteOrder)

router.post("/up/:id", C.up);

router.post("/create", C.create);

router.get("/sotest/:id", C.sotest)

module.exports = router;
