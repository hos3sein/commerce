const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const moment=require("moment")
const fetch = require("node-fetch");
const ShortUniqueId = require("short-unique-id");
const BussinessMan = require("../models/BussinessMan");
const Group = require("../models/Group");
const Buy = require("../models/Buy");
const Sales = require("../models/Sales");
const {walletUpdater,walletUpdaterApp}=require("../utils/wallet")

const {
  changeStatus,
  findTransport,
  notification,
  pushNotification,
  cancelInquery,
  cancelInqueryOtherTransport
} = require("../utils/request");
const { refresh, refreshGT,refreshGC,refreshOneOrder } = require("../utils/refresh");
const { pushNotificationStatic } = require("../utils/pushNotif");

//In connection with approve service
exports.createBussinessMan = asyncHandler(async (req, res, next) => {
  // console.log(">>>>>>>>>>>>>>>>>>>>>>>", req.body);
  const create = await BussinessMan.create(req.body);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// ! in chiye
//In connection with approve service
exports.createBuy = asyncHandler(async (req, res, next) => {
  const find = await BussinessMan.findOne({
    "user._id": req.body.buyer._id,
  });

  // console.log("find>>>>/>>>>><<<<", find);
  // console.log("req.body/>>>>>>>>><<<<req.body", req.body);

  const create = await Buy.create(req.body);

  const update = await Buy.findByIdAndUpdate(create._id, {
    "buyer.idCompany": find._id,
    "buyer.profileCompany": find.profileCompany,
    "buyer.companyName": find.companyName,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// find sales baraye transport moghe quite gereftan
exports.findSales = asyncHandler(async (req, res, next) => {
  const find = await Sales.findById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: find,
  });
});

// find sales baraye transport moghe quite gereftan
exports.findCompany = asyncHandler(async (req, res, next) => {
  const find = await BussinessMan.findOne({
    "user._id": req.params.id,
  });

  res.status(200).json({
    success: true,
    data: find,
  });
});
exports.addUserToFavorite = asyncHandler(async (req, res, next) => {
  console.log("heyyyyy");
   const userId=req.params.userId
   const orderId=req.params.orderId
   console.log("uuuuuussssserrrrr",userId,orderId);
   const sale=await Sales.findByIdAndUpdate(orderId,{
    $addToSet: {userFavorites:{userId:userId}}
   })
   
  console.log("salleeeee",sale);

   res.status(201).json({
    success:true
   })
});
exports.removeUserToFavorite = asyncHandler(async (req, res, next) => {
  console.log("hhhhhhhhh");
  const userId=req.params.userId
  const orderId=req.params.orderId
  console.log(userId,orderId);
  await Sales.findByIdAndUpdate(orderId,{
   $pull: {userFavorites:{userId:userId}}
  })
  res.status(201).json({
   success:true
  })
});




exports.getOrders = asyncHandler(async(req , res , next)=>{
  const allSales = await Sales.find({
    $and: [
      { autoPrice: true },
      {cancel:false},
      {end:false},
      // { "buyers.length": 0 },
      { $or: [{ status: 0 }, { status: 2 }, { status: 3 }] },
    ],
  });
  return res.status(200).json({
    success : true , 
    data : allSales
  })
})


exports.getForEndChecker = asyncHandler(async(req , res , next)=>{
  const allSales = await Sales.find();
  return res.status(200).json({
    success : true , 
    data : allSales
  })
})

exports.getOrderForCheckStatus = asyncHandler(async(req , res , next)=>{
  const allSales = await Sales.find( {status : 8})
  return res.status(200).json({
    success : true , 
    data : allSales
  })
})


exports.setRaise = asyncHandler(async(req , res , next)=>{
  // const order = await Sales.findById(req.body.id)
  if (req.body.type == 1){
    await Sales.findByIdAndUpdate(
        req.body.id,
        {
          raisedPrice:price,
          lastPrice:lastPrice , 
          status: 2,
        },
        { strict: false }
      );
      refreshGC();
  }else{
    await Sales.findByIdAndUpdate(
      req.body.id,
      {
        raisedPrice:price,
        lastPrice:lastPrice , 
        status: 3,
      },
      { strict: false }
    );
    refreshGC();
  }
  return res.status(200).json({
    success : true,
  })
})




exports.endOrder = asyncHandler(async(req , res , next)=>{
  await Sales.findByIdAndUpdate(
    req.params.id,
    {
      end: true,
    },
    { strict: false }
  );
  await deleteInquery(req.params.id)
  await refreshGC();
   console.log("the order overed and ended!!" , element.productName);
})




exports.releaseMoney = asyncHandler(async(req , res , next)=>{
  const order = req.body
  const allV=await getAllVarible()                      // get all settings
  const deposteAmount=allV.commerceDepositeAmount
  const comi=allV.appComistionAmountCommerce
  const userId = order.user._id
  const comAmont = order.raisedPrice*(comi/100)*100
  const depo = order.raisedPrice*(deposteAmount/100)*100
  const amount = (order.raisedPrice)*100
    
  const bidTransAction = await walletUpdater(1 , userId ,amount , `All cargo cost for commerce order ${order.productName}`,"commerce")   // bid transactio back
  const backDeposite=await walletUpdater(1 , userId , depo,`Get back deposite for commerce order ${order.productName}`,"commerce")      // deposit price back
  const getComi = await walletUpdater(0 , userId , comAmont , `App comision for commerce order ${order.productName}`,"commerce")         // get the app comision from seller wallet 
  if(!bidTransAction.success||!backDeposite.success||!getComi.success){
    return next(new ErrorResponse("Wallet transaction failed",500))
  }
  const bidTransActionA=await walletUpdaterApp(0,userId,amount,`All cargo cost for commerce order ${order.productName}`,"commerce")
  const backDepositeApp=await walletUpdaterApp(0,userId,depo,`Get back deposite for commerce order ${order.productName}`,"commerce")
  const getComiApp=await walletUpdaterApp(1,userId,comAmont,`App comision for commerce order ${order.productName}`,"commerce")
  if(!bidTransActionA.success||!backDepositeApp.success||!getComiApp.success){
    return next(new ErrorResponse("if your wallet amount change call ashAdmin",500))
  }
  const last = order.statusTime[order.statusTime.length - 1];
   
  const time = {
    status: 9,
    action: last.action + 1,
    at: Date.now(),
  };
  
  
const ss = await Sales.findByIdAndUpdate(order._id, {
  end:true,
  status : 10,
  $addToSet: { statusTime: time }
});

// console.log('the order >>>>>>>>>>>>' , ss )
recipient = {
  _id: order.user._id,
  username: order.user.companyName,
  pictureProfile: order.user.profileCompany,
};


await pushNotificationStatic(recipient._id , 12) 
await pushNotificationStatic(order.userTo._id , 12) 
const findSocket = await Sales.findById(order._id);
await refreshOneOrder(findSocket)

return res.status(200).json({
  success : true
})
})


exports.setBid = asyncHandler(async(req , res , next)=>{
 
    await Sales.findOneAndUpdate(
      {
        _id: req.body.id,
        "bids.bussId": req.body.buss._id,
      },
      {
        $set: {
          "bids.$.status": "accept",
        },
        $addToSet: { statusTime: req.body.time },
        userTo: req.body.obj,
        status: 4,
        raisedPrice: req.body.bid,
      }
    );
    refreshGC();
    return res.status(200).json({
      success : true,
    })
})


exports.changeTransortStats=asyncHandler(async (req, res, next) => {
   const {saleId,status} =req.body

   const updateSale= await Sales.findByIdAndUpdate(saleId,{
    transportStatus:status
   })
   if(!updateSale){
    return next(new ErrorResponse("sale not found",404))
   }

  await refreshGC()
   
  res.status(201).json({
   success:true 
  })
});

exports.getInfoForChart=asyncHandler(async (req, res, next) => { 
  const orders= await Sales.find()  
  const mainArray=[]

  const to1=moment().format("YYYY-MM-DD")
  const day=to1.split("-")[2]
  const frome1=moment(to1).add(-day+1,"d").format("YYYY-MM-DD")

  const obj1={frome:frome1,to:to1,totalAmount:0}
  
  const to2=moment(frome1).format("YYYY-MM-DD")
  const frome2=moment(to2).add(-1,"M").format("YYYY-MM-DD")
  
  const obj2={frome:frome2,to:to2,totalAmount:0}

  const to3=moment(frome2).format("YYYY-MM-DD")
  const frome3=moment(to3).add(-1,"M").format("YYYY-MM-DD")

  const obj3={frome:frome3,to:to3,totalAmount:0}

  const to4=moment(frome3).format("YYYY-MM-DD")
  const frome4=moment(to4).add(-1,"M").format("YYYY-MM-DD")
  const obj4={frome:frome4,to:to4,totalAmount:0}

  const to5=moment(frome4).format("YYYY-MM-DD")
  const frome5=moment(to5).add(-1,"M").format("YYYY-MM-DD")

  const obj5={frome:frome5,to:to5,totalAmount:0}

  const to6=moment(frome5).format("YYYY-MM-DD")
  const frome6=moment(to6).add(-1,"M").format("YYYY-MM-DD")

  const obj6={frome:frome6,to:to6,totalAmount:0}
  orders.forEach(item=>{
    const test=moment(item.createdAt)
    console.log(test);
    const isRange1=moment(item.createdAt).isBetween(frome1,to1)
    const isRange2=moment(item.createdAt).isBetween(frome2,to2)
    const isRange3=moment(item.createdAt).isBetween(frome3,to3)
    const isRange4=moment(item.createdAt).isBetween(frome4,to4)
    const isRange5=moment(item.createdAt).isBetween(frome5,to5)
    const isRange6=moment(item.createdAt).isBetween(frome6,to6)

    if(isRange1&&item.cancel==false&&item.status>4){
      obj1.totalAmount=obj1.totalAmount+item.bid
    }
    if(isRange2&&item.cancel==false&&item.status>4){
      obj2.totalAmount=obj2.totalAmount+item.bid
    }
    if(isRange3&&item.cancel==false&&item.status>4){
      obj3.totalAmount=obj3.totalAmount+item.bid
    }
    if(isRange4&&item.cancel==false&&item.status>4){
      obj4.totalAmount=obj4.totalAmount+item.bid
    }
    if(isRange5&&item.cancel==false&&item.status>4){
      obj5.totalAmount=obj5.totalAmount+item.bid
    }
    if(isRange6&&item.cancel==false&&item.status>4){
      obj6.totalAmount=obj6.totalAmount+item.bid
    }
  })
  
  mainArray.push(obj1)
  mainArray.push(obj2)
  mainArray.push(obj3)
  mainArray.push(obj4)
  mainArray.push(obj5)
  mainArray.push(obj6)

 res.status(200).json({
  success:true,
  mainArray
 })
});

exports.setVip = asyncHandler(async (req, res, next) => {
  const uid = await new ShortUniqueId({ length: 8 });
  const addLineMakerCode = await uid();

  await BussinessMan.findOneAndUpdate({"user._id":req.params.id}, {
    isVip: true,
    addLineMakerQrCode:addLineMakerCode
  });
  res.status(201).json({
    success: true,
  });
});
exports.removeVip = asyncHandler(async (req, res, next) => {
  const addLineMakerCode=""
  await BussinessMan.findOneAndUpdate({"user._id":req.params.id}, {
    isVip: false,
    addLineMakerQrCode:addLineMakerCode
  });
  res.status(201).json({
    success: true,
  });
});
exports.findBuss=asyncHandler(async (req, res, next) => {
  const commerce=await BussinessMan.findOne({"user._id":req.params.id})
  if(!commerce){
    return next(new ErrorResponse("Buss not found"),404)
  }
  res.status(200).json({
    success: true,
    commerce
  });
})
exports.findBussByQr=asyncHandler(async (req, res, next) => {
  const commerce=await BussinessMan.findOne({addLineMakerQrCode:req.params.id})
  if(!commerce){
    return next(new ErrorResponse("Buss not found"),404)
  }
  res.status(200).json({
    success: true,
    commerce
  });
})

exports.raisPrice=asyncHandler(async (req, res, next) => {
  const order=await Sales.findById(req.params.id)
  const type=req.params.type
  if(!order||!order.autoPrice||order.status==1){
   return next(new ErrorResponse("some thing went wrong please check your inputs value",400))
  }
  console.log("okkkkk",order.status);
  
  const difPriceCreate = (order.maxPrice - order.price) / 2;
  const difPrice = Math.abs(difPriceCreate);
  if(type==1){
   let raisedPrice
   const perPrice = (Math.abs(difPrice) * 60) / 100;
   (order.type==0)?raisedPrice=order.price+perPrice:raisedPrice=order.price-perPrice     
   order.raisedPrice=raisedPrice
   order.lastPrice=raisedPrice
   order.status=2
   await order.save()
  }
  if(type==2){
    const perPrice=(Math.abs(difPrice) * 80) / 100;
    (order.type==0)?raisedPrice=order.price+perPrice:raisedPrice=order.price-perPrice
    order.raisedPrice=raisedPrice
    order.lastPrice=raisedPrice
    order.status=3
    await order.save()
  }
  await refreshGC()
  res.status(200).json({
   success:true,
  })
})
exports.endTimeHandeler=asyncHandler(async (req, res, next) => {
  const order=await Sales.findById(req.params.id)
  
 if(!order){
  return next(new ErrorResponse("some thing went wrong please check your inputs value",400))
 }

  if(order.status<4&&order.status!=1&&order.cancel==false){
      order.end=true
      await order.save()
      await refreshGC()
      await cancelInquery(req.params.id)
  }
  if(order.status==1&&order.cancel==false){
    const sales = await Sales.findById(req.params.id);
    let userIdFind;
    sales.bids.find((item) => {
      if (item.bid == sales.bid) {
        userIdFind = item.userId;
      }
    });
  
    const buss = await BussinessMan.findOne({
      "user._id": userIdFind,
    });
  
  
    const obj = {
      _id: buss.user._id,
      idCompany: buss._id,
      profileCompany: buss.profileCompany,
      companyName: buss.companyName,
      phone: buss.user.phone,
    };
  
    const time = {
      status: 4,
      action: 0,
      at: Date.now(),
    };
    const findTrans = await findTransport(req.params.id, req.user._id);
    if (findTrans.success) {


      const cond=(sales.type==0)?sales.user._id:sales.userTo._id
  
      console.log(cond);
  
     const changeStatusresult= await changeStatus(cond,req.params.id)
  
     const cancelOtherShiing=await cancelInqueryOtherTransport((sales.type==1)?sales.user._id:sales.userTo._id)
      
      console.log("changeStatusresult",changeStatusresult.success);
  
      await Sales.findOneAndUpdate(
        {
          _id: req.params.id,
          "bids.bussId": buss._id,
        },
        {
          $set: {
            "bids.$.status": "accept",
          },
          $addToSet: { statusTime: time },
          status: 4,
          userTo: sales.type == 0 ? obj : sales.userTo,
          user: sales.type == 0 ? sales.user : obj,
          transportCompany: findTrans.data.transport,
          raisedPrice: sales.bid,
          transportStatus:4,
          haveTransport:true
        }
      );
    } else {
      console.log("elssssssssssss");
      await Sales.findOneAndUpdate(
        {
          _id: req.params.id,
          "bids.bussId": buss._id,
        },
        {
          $set: {
            "bids.$.status": "accept",
          },
          $addToSet: { statusTime: time },
          status: 4,
          userTo: sales.type == 0 ? obj : sales.userTo,
          user: sales.type == 0 ? sales.user : obj,
          raisedPrice: sales.bid,
        }
      );
    }
  
    const sender = {
      _id: sales.user._id,
      username: sales.user.companyName,
      pictureProfile: sales.user.profileCompany,
    };
  
    const recipient = {
      _id: sales.userTo._id,
      username: sales.userTo.companyName,
      pictureProfile: sales.userTo.profileCompany,
    };
  
    
  
    if (sales.type == 0) {
      await pushNotification(
        "Accept bid",
        "Your bid accepted and you must pay deposite in app",
        `${sender.username} accept your bid`,
        recipient,
        sender,
        "commerceStack",
        "Order"
      );
      await notification(
        "change status",
        sender,
        recipient,
        sales._id,
        "Order",
        "change status sales",
        "change status commerce"
      );
    } else {
      await pushNotification(
        "Accept bid",
        "Your bid accepted and you must pay deposite in app",
        `${sender.username} accept your bid`,
        recipient,
        sender,
        "commerceStack",
        "Order"
      );
      await notification(
        "change status",
        recipient,
        sender,
        sales._id,
        "Order",
        "change status sales",
        "change status commerce"
      );
    }
  
  }
  await refreshGC()
  res.status(200).json({
   success:true,
  })

})


