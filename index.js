const express = require("express");
const connectToMongo = require("./config/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const courseRoute = require("./routes/course");
const oldBooks = require("./routes/oldBooks")
const contactRoute = require("./routes/contact");
const orderRoute = require("./routes/Order");
const paymentRoute = require("./routes/Payment");
const cloudinary = require("cloudinary");
var cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const base = process.env.base || 8800;
const app = express();
const port = base;
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(
  fileUpload({
    // to upload file at cloudinary it is required to use
    useTempFiles: true,
  })
);

connectToMongo();

app.get("/", (req, res) => {
  res.send("hi buddy ji");
});

app.use("/api/auth", authRoute);
app.use("/api/course", courseRoute);
app.use("/api/contact", contactRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/book",oldBooks)

app.listen(port, () => {
  console.log("connect to backend");
});
