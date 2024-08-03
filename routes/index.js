const express = require("express");
const router = express.Router();

//prefix router Dev
const sales = require("./sales");
router.use("/sales", sales);

//prefix router Dev
const dev = require("./dev");
router.use("/dev", dev);

const interservice = require("./interservice");
router.use("/interservice", interservice);

module.exports = router;
