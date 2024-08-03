const Sales = require("./models/Sales");
const { refreshOneOrder} = require("./utils/refresh");



const moment = require("moment");
const maxPayTime="24"
const payCkeckerTime = async () => {
  const allSales = await Sales.find({
    $and: [
      {cancel:false},
      {end:false},
      { $or: [{status:4}, {status:5}] },
    ],
  });

  
  allSales.forEach(async(sale) => {
    console.log(sale.statusTime);
    const len=sale.statusTime.length
    const time=sale.statusTime[len-1].at
    
    const getmomentForLastChanfe=moment(+time).add(24,"hour")
    console.log("time",getmomentForLastChanfe.format("YYYY-MM-DD HH:mm"));
    const alan = moment()
    console.log("now",alan.format("YYYY-MM-DD HH:mm"));
    const diff = getmomentForLastChanfe.diff(alan, "minute");
    console.log(diff);
    if(diff<0){ 
     
        sale.cancel=true
        sale.end=true
        await sale.save()
        await refreshOneOrder(sale)
    }
  });
};

exports.payCkecker = async (interval) => {
  setInterval(async () => {
    await payCkeckerTime();
  }, interval);
};
