const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
// const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const { checkGroup } = require("./utils/checkGroup");
const { robatRaised, checkStatus } = require("./robatRaised");
const bodyParser = require('body-parser')


const { acceptDriver } = require("./acceptDriver");
const {payCkecker}=require("./payTimeChecker")
// const conifgPath="./config/config.env"
const conifgPath="./config/configTest.env"

dotenv.config({
  path: conifgPath,
  // debug: true,
});
// Load env vars

// Connect to database...
connectDB();
// checkGroup();         //!bayad refactor beshe
// robatRaised(5000);    //!bayad refactor beshe
// acceptDriver(6000);   //!bayad refactor beshe
// payCkecker(3600000)
// checkStatus()

// Route files
const commerce = require("./routes");

// Body parser
app.use(express.json({ limit: "25mb" }));



// Cookie parser
app.use(cookieParser());
// app.use(checkLimitationSpot);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
}

// File uploading
// app.use(
//   fileUpload({
//     createParentPath: true,
//     abortOnLimit: true,
//     fileSize: 90000000,
//   })
// );
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


// Sanitize data
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
// Prevent XSS attacks
app.use(xss());
// Prevent http param pollution
app.use(hpp());
var corsOptions = {
    
  origin: '*', // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors());
app.use(errorHandler);



// Set static folder
const public = path.join(__dirname, "public");
app.use(express.static(public));

// Mount routers
console.log(`${process.env.SERVICE_TRANSPORT}`);
console.log(`${process.env.SERVICE_PAYMENY}`);
app.use("/api/v1/commerce", commerce);

const PORT = process.env.PORT || 7010;

const expressServer = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close expressServer & exit process
  // expressServer.close(() => process.exit(1));
});

module.exports = {
  app,
};
