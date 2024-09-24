const express = require("express");

const C = require("../controllers/interservice");

const router = express.Router();

// POST
router.post("/createbusinessman", C.createBussinessMan);

router.post("/createbuy", C.createBuy);

router.get("/findsales/:id", C.findSales);

router.post("/changestatustransport", C.changeTransortStats);

router.get("/findCompany/:id", C.findCompany);

router.get("/getinfoforchart", C.getInfoForChart);

router.get("/setvip/:id",C.setVip)

router.get("/unsetvip/:id",C.removeVip)

router.get("/findbuss/:id",C.findBuss)

router.get("/findbusswithqr/:id",C.findBussByQr)

router.get("/adduserfavorite/:userId/:orderId",C.addUserToFavorite)
router.get("/removeuserfavorite/:userId/:orderId",C.removeUserToFavorite)

//


router.get('/getAllOrders' , C.getOrders)

router.get('/getAllForEndChecker' , C.getForEndChecker)

router.put('/setRaise' , C.setRaise)

router.put('/cancelOrder/:id' , C.endOrder)

router.put('/release' , C.releaseMoney)
router.put('/setBid' , C.releaseMoney)




router.get('/getOrdersforcheckStatus' , C.getOrderForCheckStatus)


router.get("/raisprice/:id/:type",C.raisPrice)
router.get("/endhandeler/:id",C.endTimeHandeler)

// router.get("/dellall", C.delAll);

module.exports = router;
