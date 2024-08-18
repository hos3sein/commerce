const Sales = require("./models/Sales");
const { pushNotificationStatic } = require("./utils/pushNotif");
const { refresh, refreshGC, refreshGT, refreshOneOrder } = require("./utils/refresh");
const { addRefresh, getAllVarible } = require("./utils/request");
const { walletUpdater, walletUpdaterApp } = require("./utils/wallet");
const moment = require("moment");

const check = async () => {
  

  const allSales = await Sales.find({
    $and: [
      { autoPrice: true },
      {cancel:false},
      {end:false},
      // { "buyers.length": 0 },
      { $or: [{ status: 0 }, { status: 2 }, { status: 3 }] },
    ],
  });

  for (let i = 0; i < allSales.length; i++) {
    const element = allSales[i];

    if (element.bids.length == 0) {
      const closeTime = moment(`${element.createdAt}`)
        .add(`${element.closingDate}`, "hour")
        .format("YYYY/MM/DD HH:mm");

      const createTime = moment(`${element.createdAt}`).format(
        "YYYY/MM/DD HH:mm"
      );

      const currentDate = moment(closeTime);
      const returnDate = moment(createTime);

      const alan = moment();

      const diff = currentDate.diff(returnDate, "minutes");
      // console.log("diff", diff);

      const now = alan.diff(returnDate, "minutes");

      const res = (diff * 60) / 100;
      const res2 = (diff * 80) / 100;

      const difPriceCreate = (element.maxPrice - element.price) / 2;

      const difPrice = Math.abs(difPriceCreate);
      // console.log("res", now);
      // console.log("res", res1);

      // console.log("res", res2);

      const perPrice = (Math.abs(difPrice) * 60) / 100;
      const perPrice2 = (Math.abs(difPrice) * 80) / 100;

      if (now >= res && now <= res2 && element.status == 0) {
        // console.log(">>>>>>11111");
        await Sales.findByIdAndUpdate(
          element._id,
          {
            raisedPrice:
              element.type == 1
                ? element.raisedPrice + difPrice
                : element.raisedPrice - difPrice,
            lastPrice:
              element.type == 1
                ? element.raisedPrice + difPrice
                : element.raisedPrice - difPrice,
            status: 2,
          },
          { strict: false }
        );

        
        refreshGC();
      }

      if (now >= res2 && now <= diff && element.status == 2) {
        // console.log(">>>2222");

        await Sales.findByIdAndUpdate(
          element._id,
          {
            raisedPrice:
              element.type == 1
                ? element.raisedPrice + difPrice
                : element.raisedPrice - difPrice,
            lastPrice:
              element.type == 1
                ? element.raisedPrice + difPrice
                : element.raisedPrice - difPrice,

            status: 3,
          },
          { strict: false }
        );

        // await addRefresh(
        //   element.type == 0 ? element.user._id : element.userTo._id,
        //   "refreshCommerce"
        // );

        // await refresh(
        //   element.type == 0 ? element.user._id : element.userTo._id,
        //   "refreshCommerce"
        // );

        refreshGC();
      }

      // console.log(difPrice);
    }
  }

  //   $and: [{ autoPrice: true }],
  // { $or: [{ status: 0 }, { status: 2 }, { status: 3 }] },
  // { "buyers.length": 0 },
};

// check();

exports.robatRaised = async (interval) => {
  setInterval(async () => {
    await check();
  }, interval);
};



exports.checkStatus = async()=>{
  setInterval(async() => {
    console.log('start the check status')
    const orders = await Sales.find( {status : 8})
    orders.forEach(async elem=>{
    console.log(`${elem.productName} is waiting for buyer confirmaition for reciveing the cargo...`)
    const time = parseInt(elem.statusTime[elem.statusTime.length-1].at)
    const currentTime = new Date()
    const LastTime = new Date(time)
    // console.log(currentTime-LastTime)
    // console.log(24*60*60*1000)
    if ((currentTime-LastTime) > 24*60*60*1000){
      console.log(`the finisher for order ${elem.productName}`)
      const releaser = releaseMoney(elem);
      console.log(releaser)
      console.log(`release money for order : ${elem._id}`)
    }else{
        const id = elem.userTo._id
        await pushNotificationStatic(id , 20)
    }
  })
  }, 24*60*60*1000);
}


const releaseMoney = async(order)=>{
  const allV=await getAllVarible()                      // get all settings
  const deposteAmount=allV.commerceDepositeAmount
  const comi=allV.appComistionAmountCommerce
  const userId = order.user._id
  const comAmont = order.raisedPrice*(comi/100)*100
  const depo = order.raisedPrice*(deposteAmount/100)*100
  const amount = (order.raisedPrice)*100
    
  const bidTransAction = await walletUpdater(1 , userId,amount , `All cargo cost for commerce order ${order.productName}`,"commerce")   // bid transactio back
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

return true

}
