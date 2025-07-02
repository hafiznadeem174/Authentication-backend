const express = require("express");
const app = express();
const cors = require('cors');
const authRouter = require("./Routes/AuthRouter.js");
const productRouter = require("./Routes/ProductRouter.js");
require("dotenv").config();
require("./Models/db.js");
app.use(express.json());
const PORT = process.env.PORT || 8080;
app.get("/ping", (req, res) => {
    res.send('pong');
});


app.use(cors());
app.use("/auth", authRouter);
app.use("/products", productRouter);

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});