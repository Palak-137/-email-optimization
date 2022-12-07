const express = require("express");
const req = require("express/lib/request");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
require("./mail/transporter");
require("./processors/index.js")

const app = express();

app.use(express.json());

app.use("/users", userRoutes);

const MONGODB_URI = "mongodb+srv://Palak:12345@cluster0.k1ha6.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI)
  .then((success) => console.log("Mongodb connected successfully..."))
  .catch((error) => console.log(error));

const PORT = 4000;

app.listen(PORT, () => console.log(`App is running on ${PORT}...`));
