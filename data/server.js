import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pizzas = "./pizzas.json";
const allergens = "./allergens.json";
const orders = "./orders.json";

const pizzaData = fs.readFileSync(pizzas);
const pizzasJSON = JSON.parse(pizzaData);
const allergenData = fs.readFileSync(allergens);
const allergensJSON = JSON.parse(allergenData);
const orderData = fs.readFileSync(orders);
const ordersJSON = JSON.parse(orderData);

app.get("/api/pizzas", (req, res) => {
	res.send(pizzasJSON);
});

app.listen(3000);
