const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const fetch = require("node-fetch");
const {pushNotification}=require("../utils/request")
// const Pending = require("../models/Pending");
const Group = require("../models/Group");
const Sales = require("../models/Sales");
const Buy = require("../models/Buy");
const BussinessMan = require("../models/BussinessMan");
const { refreshGC,refreshOneOrder} = require("../utils/refresh");

exports.createPerm = asyncHandler(async (req, res, next) => {
  const { data } = req.body;
  try {
    console.log(">>req.body.data");
    const urll = `${process.env.SERVICE_SETTING}/api/v1/setting/dev/createperm`;
    const rawResponse = await fetch(urll, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await rawResponse.json();

    if (response.success) {
      res.status(200).json({
        success: true,
        data: {},
      });
    }
  } catch (err) {
    console.log("err", err);
  }
});

exports.delAll = asyncHandler(async (req, res, next) => {
  await Sales.remove();
 

  // await Group.remove();

  res.status(200).json({
    success: true,
    dta: {},
  });
});

exports.all = asyncHandler(async (req, res, next) => {
  const find = await BussinessMan.find().sort({ createdAt: -1 });
  const findB = await Buy.find();
  const findS = await Sales.find().sort({ createdAt: -1 });

  // await Group.remove();

  res.status(200).json({
    success: true,
    dta: { buuuuuuuuuuu: find, bbbbbbbbbb: findB, ssssssss: findS },
  });
});

exports.delB = asyncHandler(async (req, res, next) => {
  const find = await BussinessMan.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    dta: {},
  });
});
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const isAdmin = req.user.group.includes("admin");
  const isSuperAdmin = req.user.group.includes("superAdmin");
  if (isAdmin || isSuperAdmin) {
    const findOrder= await Sales.findByIdAndRemove(req.params.id);
    await refreshGC();
    return res.status(200).json({
      success: true,
      data: {},
    });
  }
  else{
    return res.status(401).json({
      success: true,
      err: "you cant acces this route",
    });
  }
  
});

exports.up = asyncHandler(async (req, res, next) => {
  const { closingDate, bids, bid, status, user, userTo } = req.body;
  const find = await Sales.findByIdAndUpdate(req.params.id, {
    status,
    bids,
    bid,
    userTo,
  });

  res.status(200).json({
    success: true,
    dta: {},
  });
});

exports.create = asyncHandler(async (req, res, next) => {
  const {
    user,
    group,
    companyName,
    companyLicensePhoto,
    companyAddress,
    idCard,
    idCardPhoto,
    profileCompany,
  } = req.body;
  const find = await BussinessMan.create({
    user,
    group,
    companyName,
    companyLicensePhoto,
    companyAddress,
    idCard,
    idCardPhoto,
    profileCompany,
  });

  res.status(200).json({
    success: true,
    dta: {},
  });
});

exports.createPushNotifcation = asyncHandler(async (req, res, next) => {
    
  

 

  res.status(200).json({
    success: true,
    dta: {},
  });
});
exports.sotest=asyncHandler(async (req, res, next) => {
  const find=await Sales.findById(req.params.id)
  console.log(find);
   await refreshOneOrder(find)
   res.status(200).json({
     success: true,
   });
 })