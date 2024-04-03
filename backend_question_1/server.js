const express = require("express");
const getProducts = require('./controllers/pageControllers.js')
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/categories/:categoryname/products",getProducts);
app.use("/categories/:categoryname/products/:productid");

//not used dotenv file for easy setup when testing
app.listen(4000, () => {
	console.log("listening on 4000");
});
