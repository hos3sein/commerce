const { response } = require("express");
const fetch = require("node-fetch");

exports.addLoc = async (loc, id) => {
  const url = `${process.env.SERVICE_AUTHENTICATION}/api/v1/auth/dev/addloc/${id}`;

  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locations: loc }),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.notification = async (
  notificationType,
  recipient,
  sender,
  relation,
  relationModel,
  title,
  message
) => {
  const url = `${process.env.SERVICE_NOTIFICATION}/api/v1/notification/create`;
  //  const url = `http://localhost:8006/api/v1/notification/create`;


  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationType,
        recipient,
        sender,
        relation,
        relationModel,
        title,
        message,
      }),
    });
    const response = await rawResponse.json();

    if (response.success) {
      // console.log("success");
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.pushNotification = async (
  notificationType,
  title,
  message,
  recipient,  
  sender,
  navigate,
  relationModel
) => {
  const url = `${process.env.SERVICE_NOTIFICATION}/api/v1/notification/pushnotification/createpushnotif`;
  //  const url = `http://localhost:8006/api/v1/notification/pushnotification/createpushnotif`;
 
    
  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationType,
        title,
        message,
        recipient,
        sender,
        navigate,
        relationModel
      }),
    });
    const response = await rawResponse.json();

    if (response.success) {
      // console.log("success");
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.checkToken = async (token) => {
  // console.log("token>>>>>>>>", token);
  const url = `${process.env.SERVICE_AUTHENTICATION}/api/v1/auth/checktoken`;

  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.changeStatus = async (userId,saleId) => {
  const url = `${process.env.SERVICE_TRANSPORT}/api/v1/transport/interservice/changestatus`;

  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       userId,
       saleId
      }),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};
exports.changeStatuscommerce = async (saleId,status,action,id) => {
  const url = `${process.env.SERVICE_TRANSPORT}/api/v1/transport/interservice/changestatuscommerce`;

  //  const url = `http://localhost:8011/api/v1/transport/interservice/changestatuscommerce`;

  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       status,
       saleId,
       action,
       userId:id
      }),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false
  }
};

exports.msgInqury = async (id, time) => {
  const url = `${process.env.SERVICE_TRANSPORT}/api/v1/transport/interservice/msg/${id}`;

  try {
    const rawResponse = await fetch(url, {
      method: "Post",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: time.status,
        action: time.action,
        text: time.text,
        image: time.image,
        user: time.user,
        username: time.username,
        phone: time.phone,
        pictureProfile: time.pictureProfile,
        at: time.at,
      }),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.findTransport = async (id, user) => {
  const url = `${process.env.SERVICE_TRANSPORT}/api/v1/transport/interservice/find/${id}/${user}`;
  console.log("ffffffffff",url);
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    // console.log("response>>>>>>>>>>>>>", response);
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.createUserL = async (data) => {
  const url = `${process.env.SERVICE_AUTHENTICATION}/api/v1/auth/interservice/createuserlineMaker`;

  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.createPendingL = async (data) => {
  const url = `${process.env.SERVICE_APPROVE}/api/v1/approve/interservice/createrequestlineMaker`;

  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.createLineMaker = async (data) => {
  const url = `${process.env.SERVICE_LINEMAKER}/api/v1/linemaker/interservice/createlinemaker`;

  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.addRefresh = async (user, subject) => {
  // const url = `http://106.14.208.28:8050/api/v1/refresh/create`;

  // try {
  //   const rawResponse = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       Accept: "*/*",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       user,
  //       subject,
  //     }),
  //   });
  //   const response = await rawResponse.json();

  //   if (response.success) {
  //     // console.log("success");
  //   }
  // } catch (error) {
  //   console.log("error", error);
  // }
};
exports.getFavoriteOrders=async (userId) => {
  const url = `${process.env.SERVICE_FAVORITE}/favorite/getuserfavoritecommerce/${userId}`;

  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response.data;
    } else {
      return false;
    }
  } catch (err) {
    console.log("err", err);
    return false
  }
};
exports.getFavoriteOrdersAdmin=async (userId) => {
  const url = `${process.env.SERVICE_FAVORITE}/favorite/getuserfavoritecommerceadmin/${userId}`;

  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};
exports.deleteInquery = async (id) => {
  const url = `${process.env.SERVICE_TRANSPORT}/api/v1/transport/interservice/handeldelete/${id}`;


  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    // console.log("response>>>>>>>>>>>>>", response);
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.transportInspection = async (id, type) => {
  const url = `${process.env.SERVICE_TRANSPORT}/api/v1/transport/interservice/inpection/${type}/${id}`;

  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    // console.log("response>>>>>>>>>>>>>", response);
    if (response.success) {
      return response;
    } else {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};

exports.cancelInquery = async (id) => {
  const url = `${process.env.SERVICE_TRANSPORT}/api/v1/transport/interservice/handelCancel`;

  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id:id
      }),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};
exports.cancelInqueryOtherTransport = async (requester,id) => {
  const url = `${process.env.SERVICE_TRANSPORT}/api/v1/transport/interservice/cancelaftercontract`;

  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id:id,
        requester
      }),
    });
    const response = await rawResponse.json();
    if (response.success) {
      return response;
    }
  } catch (err) {
    console.log("err", err);
  }
};
exports.getAllVarible = async () => {
  const url = `https://ashmoresetting.chinabizsetup.com/api/v1/setting/variable/all`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
       console.log(response.data);
       return response.data
  } catch (error) {
    console.log("error", error);
  }
};




exports.newLog=async (body) => {
  console.log("here");
    const url = `${process.env.SERVICE_SETTING}/api/v1/setting/log/putlog`;
    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*",
          "Content-Type": "application/json",
        },
        body:JSON.stringify(body)
      });
      const response = await rawResponse.json();
      console.log(response);
      if (response.success) {
        console.log("nice");
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("err", err);
    }
  };