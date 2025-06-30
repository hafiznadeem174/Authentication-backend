const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require("./Routes/AuthRouter.js"); // Ensure this file exists and exports the router
const productRouter = require("./Routes/ProductRouter.js"); // Ensure this file exists and exports the router
require("dotenv").config();
require("./Models/db.js"); // Ensure this file exists and connects to your database
app.use(express.json());


const PORT = process.env.PORT || 8080;


app.get("/ping", (req, res) => {
  res.send('pong');
});

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter); 
app.use("/products", productRouter); // Ensure this file exists and exports the router



app.listen(PORT, () => {
  console.log(`✅ Server is running on port nadeem ${PORT}`);
});
