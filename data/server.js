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

const pizzasJSON = JSON.parse(fs.readFileSync(pizzas));
const allergensJSON = JSON.parse(fs.readFileSync(allergens));
const ordersJSON = JSON.parse(fs.readFileSync(orders));

app.get("/api/pizzas", (req, res) => {
	res.send(pizzasJSON);
});

app.get("/api/allergens", (req, res) => {
	res.send(allergensJSON);
});

app.post("/api/orders", (req, res) => {
	let { ...newOrder } = req.body;
	fs.readFile("orders.json", (err, data) => {
		if (err) throw err;

		let newOrders = [...ordersJSON.orders, newOrder];

		ordersJSON.orders = newOrders;

		fs.writeFile("orders.json", JSON.stringify(ordersJSON, null, 2), (err) => {
			if (err) throw err;
			console.log(newOrder);
			console.log("order successful");
			res.send("order successful");
		});
	});
});

app.listen(3009);
